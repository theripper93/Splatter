import { BloodSplatter } from "./BloodSplatter.js";

const SETTING = "tokenBlood";
const SPLAT_TEXTURES = 26;
const SPLAT_SIZE = 288;
const ANIMATION_MS = 400;

export const DEFAULT_CURVE = {
  p0: { x: 0, y: 0 },
  p1: { x: 35, y: 15 },
  p2: { x: 65, y: 80 },
  p3: { x: 100, y: 100 },
};

export const DEFAULT_CONFIG = {
  enabled: true,
  opacity: 0.8,
  splatCount: 8,
  splatScale: 2,
  curve: DEFAULT_CURVE,
};

export function evaluateCurve(curve, x) {
  const { p0, p1, p2, p3 } = curve;
  if (x <= p0.x) return Math.clamp(p0.y, 0, 100);
  if (x >= p3.x) return Math.clamp(p3.y, 0, 100);
  const bezier = (t, a, b, c, d) => {
    const mt = 1 - t;
    return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
  };
  let lo = 0;
  let hi = 1;
  let t = 0.5;
  for (let i = 0; i < 24; i++) {
    t = (lo + hi) / 2;
    if (bezier(t, p0.x, p1.x, p2.x, p3.x) < x) lo = t;
    else hi = t;
  }
  return Math.clamp(Math.round(bezier(t, p0.y, p1.y, p2.y, p3.y) * 100) / 100, 0, 100);
}

function seededRandom(seed) {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export class TokenBlood {
  static overlays = new WeakMap();

  static register() {
    game.settings.register("splatter", SETTING, {
      scope: "world",
      config: false,
      type: Object,
      default: DEFAULT_CONFIG,
    });

    game.settings.register("splatter", "tokenBloodAnnounced", {
      scope: "world",
      config: false,
      type: Boolean,
      default: false,
    });

    game.settings.registerMenu("splatter", "tokenBloodMenu", {
      name: game.i18n.localize("splatter.tokenBlood.menu.name"),
      label: game.i18n.localize("splatter.tokenBlood.menu.label"),
      hint: game.i18n.localize("splatter.tokenBlood.menu.hint"),
      icon: "fas fa-droplet",
      type: TokenBloodConfig,
      restricted: true,
    });

    Hooks.once("ready", TokenBlood.announce);
    Hooks.on("drawToken", (token) => TokenBlood.refresh(token, { animate: false }));
    Hooks.on("refreshToken", (token) => TokenBlood.overlays.get(token)?.sync());
    Hooks.on("destroyToken", (token) => {
      TokenBlood.overlays.get(token)?.destroy({ children: true });
      TokenBlood.overlays.delete(token);
    });
    Hooks.on("updateActor", (actor) => {
      for (const token of actor.getActiveTokens()) TokenBlood.refresh(token);
    });
    Hooks.on("updateToken", (tokenDocument, changes) => {
      if (changes.flags?.splatter && tokenDocument.object) TokenBlood.refresh(tokenDocument.object);
    });
    const onSetting = (setting) => {
      if (setting.key.startsWith("splatter.")) TokenBlood.refreshAll();
    };
    Hooks.on("createSetting", onSetting);
    Hooks.on("updateSetting", onSetting);
  }

  static async announce() {
    if (game.user !== game.users.activeGM || game.settings.get("splatter", "tokenBloodAnnounced")) return;
    await game.settings.set("splatter", "tokenBloodAnnounced", true);
    await ChatMessage.implementation.create({
      speaker: { alias: "Splatter" },
      whisper: ChatMessage.implementation.getWhisperRecipients("GM"),
      content: `<h3>${game.i18n.localize("splatter.tokenBlood.announce.title")}</h3>
        <p>${game.i18n.localize("splatter.tokenBlood.announce.content")}</p>`,
    });
  }

  static get config() {
    return foundry.utils.mergeObject(DEFAULT_CONFIG, game.settings.get("splatter", SETTING) ?? {}, { inplace: false });
  }

  static refreshAll() {
    if (!canvas.ready) return;
    for (const token of canvas.tokens.placeables) TokenBlood.refresh(token, { animate: false });
  }

  static refresh(token, { animate = true } = {}) {
    if (!token.mesh || token.destroyed) return;
    const config = TokenBlood.config;
    const enabled = config.enabled && game.settings.get("splatter", "enableTokenBlood");
    const actor = token.actor;
    const health = actor ? BloodSplatter.getHealthPercent(actor) : undefined;
    const amount = enabled && health !== undefined ? evaluateCurve(config.curve, 100 - health) : 0;
    let overlay = TokenBlood.overlays.get(token);
    if (!amount && !overlay) return;
    if (!overlay || overlay.destroyed) {
      overlay = new TokenBloodOverlay(token);
      TokenBlood.overlays.set(token, overlay);
    }
    overlay.configure(config, BloodSplatter.getBloodColor(token) ?? { color: 0xa51414, alpha: 0.85 });
    overlay.setAmount(amount, animate);
    overlay.sync();
  }
}

const TOKEN_ALPHA_THRESHOLD = 0.75;

const TOKEN_MASK_PROGRAM = PIXI.Program.from(
  `
  attribute vec2 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat3 projectionMatrix;
  uniform mat3 translationMatrix;
  uniform mat3 uTextureMatrix;
  varying vec2 vTextureCoord;

  void main() {
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;
  }`,
  `
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform vec4 uColor;
  uniform float alphaThreshold;

  void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    gl_FragColor = color.a < alphaThreshold ? vec4(0.0) : color * uColor;
  }`
);

class TokenBloodFilter extends PIXI.Filter {
  constructor() {
    super(
      undefined,
      `
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform vec4 inputSize;
      uniform vec3 bloodColor;

      void main() {
        vec4 src = texture2D(uSampler, vTextureCoord);
        if (src.a <= 0.0) {
          gl_FragColor = vec4(0.0);
          return;
        }
        vec3 color = src.rgb / src.a;
        float luminance = dot(color, vec3(0.299, 0.587, 0.114));
        // Multiply keeps the shading of the image, the luminance tint keeps the blood saturated on dark images
        vec3 multiplied = color * bloodColor;
        vec3 tinted = bloodColor * (0.2 + 1.2 * luminance);
        vec3 blood = mix(multiplied, tinted, 0.4);
        // Thicker blood (overlapping splats) is darker
        blood *= mix(1.0, 0.6, smoothstep(0.3, 1.0, src.a));
        // Darker rim where the blood ends, like drying blood
        vec2 step = inputSize.zw * 3.0;
        float around = (texture2D(uSampler, vTextureCoord + vec2(step.x, 0.0)).a
          + texture2D(uSampler, vTextureCoord - vec2(step.x, 0.0)).a
          + texture2D(uSampler, vTextureCoord + vec2(0.0, step.y)).a
          + texture2D(uSampler, vTextureCoord - vec2(0.0, step.y)).a) * 0.25;
        blood *= 1.0 - 0.5 * clamp((src.a - around) * 3.0, 0.0, 1.0);
        gl_FragColor = vec4(clamp(blood, 0.0, 1.0) * src.a, src.a);
      }`,
      { bloodColor: new Float32Array([0.65, 0.08, 0.08]) }
    );
    this.resolution = canvas.app.renderer.resolution;
  }
}

class TokenBloodOverlay extends PIXI.Container {
  constructor(token) {
    super();
    this.token = token;
    this.amount = 0;
    this.targetAmount = 0;
    this.clip = this.addChild(new PIXI.Graphics());
    this.mask = this.clip;
    this.bloodLayer = this.addChild(new PIXI.Container());
    this.filter = new TokenBloodFilter();
    this.bloodLayer.filters = [this.filter];
    this.splats = this.bloodLayer.addChild(new PIXI.Container());
    this.maskMesh = this.bloodLayer.addChild(new PIXI.SimplePlane(PIXI.Texture.EMPTY, 2, 2));
    this.maskMesh.shader = new PIXI.MeshMaterial(PIXI.Texture.EMPTY, {
      program: TOKEN_MASK_PROGRAM,
      uniforms: { alphaThreshold: TOKEN_ALPHA_THRESHOLD },
    });
    this.maskMesh.blendMode = PIXI.BLEND_MODES.SRC_IN;
    this._animate = this._animate.bind(this);
  }

  configure(config, bloodColor) {
    this.config = config;
    this.bloodColor = bloodColor;
    PIXI.Color.shared.setValue(bloodColor.color).toRgbArray(this.filter.uniforms.bloodColor);
    this._layoutKey = null;
  }

  setAmount(amount, animate) {
    this.targetAmount = amount;
    canvas.app.ticker.remove(this._animate);
    if (animate && amount !== this.amount) canvas.app.ticker.add(this._animate);
    else {
      this.amount = amount;
      this._updateSplats();
    }
  }

  _animate() {
    if (this.destroyed) return canvas.app.ticker.remove(this._animate);
    const step = (100 * canvas.app.ticker.deltaMS) / ANIMATION_MS;
    const delta = this.targetAmount - this.amount;
    if (Math.abs(delta) <= step) {
      this.amount = this.targetAmount;
      canvas.app.ticker.remove(this._animate);
    } else this.amount += Math.sign(delta) * step;
    this._updateSplats();
  }

  sync() {
    const token = this.token;
    const mesh = token.mesh;
    if (!mesh || mesh.destroyed || this.destroyed) return;
    if (this.parent !== mesh) mesh.addChild(this);
    const texture = mesh.texture;
    if (!texture?.valid || texture === PIXI.Texture.EMPTY) {
      this.visible = false;
      return;
    }
    if (this.maskMesh.texture !== texture) {
      this.maskMesh.texture = texture;
      this.maskMesh.position.set(-texture.width / 2, -texture.height / 2);
    }

    const k = (token.hasDynamicRing && token.ring?.textureScaleAdjustment) || 1;
    const { width, height } = texture.orig;
    const { x: ax, y: ay } = mesh.anchor;
    const padX = mesh.paddingX ?? 0;
    const padY = mesh.paddingY ?? 0;
    const layoutKey = `${width}|${height}|${ax}|${ay}|${k}|${padX}|${padY}`;
    if (layoutKey === this._layoutKey) return;
    this._layoutKey = layoutKey;

    const cx = (0.5 - ax) * width;
    const cy = (0.5 - ay) * height;
    this.bloodLayer.position.set(cx, cy);
    this.bloodLayer.scale.set(1 / k);

    const left = Math.max(-ax * width - padX, cx - width / (2 * k));
    const top = Math.max(-ay * height - padY, cy - height / (2 * k));
    const right = Math.min((1 - ax) * width + padX, cx + width / (2 * k));
    const bottom = Math.min((1 - ay) * height + padY, cy + height / (2 * k));
    this.clip.clear().beginFill(0xffffff).drawRect(left, top, right - left, bottom - top).endFill();

    this._buildSplats(width, height);
  }

  _buildSplats(width, height) {
    for (const child of this.splats.removeChildren()) child.destroy();
    const random = seededRandom(this.token.document.id ?? this.token.id ?? "token");
    const count = Math.max(1, Math.round(this.config.splatCount));
    const size = Math.min(width, height);
    for (let i = 0; i < count; i++) {
      const sprite = PIXI.Sprite.from(`modules/splatter/bloodsplats/blood${Math.floor(random() * SPLAT_TEXTURES)}.svg`);
      sprite.anchor.set(0.5, 0.5);
      sprite.position.set(
        ((random() + random()) / 2 - 0.5) * width * 0.8,
        ((random() + random()) / 2 - 0.5) * height * 0.8
      );
      sprite.rotation = random() * Math.PI * 2;
      sprite.baseScale = ((size * (0.35 + random() * 0.3)) / SPLAT_SIZE) * this.config.splatScale;
      this.splats.addChild(sprite);
    }
    this._updateSplats();
  }

  _updateSplats() {
    const splats = this.splats.children;
    this.visible = this.amount > 0 && splats.length > 0;
    if (!this.visible) return;
    const { alpha } = this.bloodColor;
    const slot = 100 / splats.length;
    splats.forEach((sprite, i) => {
      const fill = Math.clamp((this.amount - i * slot) / slot, 0, 1);
      sprite.visible = fill > 0;
      sprite.alpha = alpha * this.config.opacity * fill;
      sprite.scale.set(sprite.baseScale * (0.6 + 0.4 * fill));
    });
  }

  destroy(options) {
    canvas.app?.ticker.remove(this._animate);
    super.destroy(options);
  }
}

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class TokenBloodConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "splatter-token-blood-config",
    tag: "form",
    window: {
      title: "splatter.tokenBlood.config.title",
      icon: "fas fa-droplet",
      contentClasses: ["standard-form"],
    },
    position: { width: 480, height: "auto" },
    form: {
      handler: TokenBloodConfig._onSubmit,
      closeOnSubmit: true,
    },
    actions: {
      resetCurve: TokenBloodConfig._onResetCurve,
    },
  };

  static PARTS = {
    form: {
      template: "modules/splatter/templates/token-blood-config.hbs",
      classes: ["standard-form", "scrollable"],
      scrollable: [""]
    },
    footer: {
      template: "templates/generic/form-footer.hbs"
    },
  };

  curve = foundry.utils.deepClone(TokenBlood.config.curve);

  async _prepareContext() {
    const points = ["p0", "p1", "p2", "p3"].map((id) => ({ id, locked: id === "p0" || id === "p3" }));
    return {
      config: TokenBlood.config,
      splatTextures: SPLAT_TEXTURES,
      points,
      buttons: [{ type: "submit", icon: "fa-solid fa-save", label: "splatter.common.save" }],
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const svg = this.element.querySelector("svg");
    const toCurve = (event) => {
      const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
      return { x: Math.clamp(p.x, 0, 100), y: Math.clamp(100 - p.y, 0, 100) };
    };

    let dragging = null;
    for (const circle of svg.querySelectorAll("circle.point")) {
      circle.addEventListener("pointerdown", (event) => {
        dragging = circle.dataset.point;
        svg.setPointerCapture(event.pointerId);
        event.preventDefault();
      });
    }
    svg.addEventListener("pointermove", (event) => {
      if (dragging) this._setPoint(dragging, toCurve(event));
    });
    const endDrag = (event) => {
      if (!dragging) return;
      dragging = null;
      svg.releasePointerCapture(event.pointerId);
    };
    svg.addEventListener("pointerup", endDrag);
    svg.addEventListener("pointercancel", endDrag);
    this._drawCurve();
  }

  _setPoint(id, { x, y }) {
    if (id === "p0") x = 0;
    if (id === "p3") x = 100;
    this.curve[id] = { x: Math.round(Math.clamp(x, 0, 100)), y: Math.round(Math.clamp(y, 0, 100)) };
    this._drawCurve();
  }

  _drawCurve() {
    const svg = this.element.querySelector("svg");
    const { p0, p1, p2, p3 } = this.curve;
    const pt = (p) => `${p.x} ${100 - p.y}`;
    svg.querySelector(".curve").setAttribute("d", `M ${pt(p0)} C ${pt(p1)}, ${pt(p2)}, ${pt(p3)}`);
    const handles = svg.querySelectorAll(".handle");
    [
      [p0, p1],
      [p3, p2],
    ].forEach(([a, b], i) => {
      handles[i].setAttribute("x1", a.x);
      handles[i].setAttribute("y1", 100 - a.y);
      handles[i].setAttribute("x2", b.x);
      handles[i].setAttribute("y2", 100 - b.y);
    });
    for (const [id, p] of Object.entries(this.curve)) {
      const circle = svg.querySelector(`circle[data-point="${id}"]`);
      circle.setAttribute("cx", p.x);
      circle.setAttribute("cy", 100 - p.y);
    }
  }

  static _onResetCurve() {
    this.curve = foundry.utils.deepClone(DEFAULT_CURVE);
    this._drawCurve();
  }

  static async _onSubmit(event, form, formData) {
    const data = formData.object;
    await game.settings.set("splatter", SETTING, {
      enabled: !!data.enabled,
      opacity: Number(data.opacity),
      splatCount: Number(data.splatCount),
      splatScale: Number(data.splatScale),
      curve: this.curve,
    });
  }
}
