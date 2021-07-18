class BloodSplatter {
  constructor() {
    this.blood = new PIXI.Container();
    this.blood.name = "blood";
    const colorData = this.ColorStringToHexAlpha(
      game.settings.get("splatter", "bloodColor")
    );
    this.color = colorData?.color;
    this.alpha = colorData?.alpha;
    this.bloodSheet = game.settings.get("splatter", "useBloodsheet");
    this.bloodSheetData = game.settings.get("splatter", "BloodSheetData");
    this.scaleMulti =
      (canvas.dimensions.size / 100) *
      game.settings.get("splatter", "bloodsplatterScale");
    canvas.background.addChild(this.blood);
    canvas.background.BloodSplatter = this;
  }

  Splat(position, scale, color, alpha) {
    let scaleRandom = 0.8 + Math.random() * 0.4;
    let sprite = new PIXI.Sprite.from(
      `modules/splatter/bloodsplats/blood${Math.floor(Math.random() * 26)}.svg`
    );
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(position.x, position.y);
    sprite.scale.set(
      scale * this.scaleMulti * scaleRandom,
      scale * this.scaleMulti * scaleRandom
    );
    sprite.alpha = alpha ?? this.alpha;
    sprite.tint = color || this.color;
    sprite.rotation = Math.random() * Math.PI * 2;
    this.blood.addChild(sprite);
  }

  SplatFromToken(token, extraScale = 1) {
    const colorFlag = token.data.flags.splatter?.bloodColor;
    let colorData = {};
    if (!colorFlag && this.bloodSheet) {
      const creatureType = this.creatureType(token);
      colorData = this.ColorStringToHexAlpha(this.bloodSheetData[creatureType]);
    }
    if (colorFlag) {
      colorData = this.ColorStringToHexAlpha(colorFlag);
    }
    this.Splat(
      token.center,
      token.data.scale *
        Math.max(token.data.width, token.data.height) *
        extraScale,
      colorData?.color,
      colorData?.alpha
    );
  }

  Destroy() {
    this.blood.destroy({ children: true, texture: true });
    canvas.background.BloodSplatter = null;
  }

  Update() {
    const colorData = this.ColorStringToHexAlpha(
      game.settings.get("splatter", "bloodColor")
    );
    this.color = colorData?.color;
    this.alpha = colorData?.alpha;
    this.bloodSheet = game.settings.get("splatter", "useBloodsheet");
    this.bloodSheetData = game.settings.get("splatter", "BloodSheetData");
    this.scaleMulti = game.settings.get("splatter", "bloodsplatterScale");
  }

  ColorStringToHexAlpha(colorString) {
    if (!colorString) return undefined;
    const color = "0x" + colorString.slice(1, 7);
    const alpha = parseInt(colorString.slice(7), 16) / 255;
    return { color: color, alpha: alpha };
  }

  creatureType(token) {
    return (
      BloodSplatter.getCreatureTypeCustom(token.actor.data) ||
      BloodSplatter.getCreatureType(token.actor.data)
    );
  }

  static socketSplatFn(tokenIds) {
    for (let tokenId of tokenIds) {
      let token = canvas.tokens.get(tokenId);
      if (!token) return;
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.SplatFromToken(token);
      } else {
        new BloodSplatter();
        canvas.background.BloodSplatter.SplatFromToken(token);
      }
    }
  }

  static socketSplat(tokens) {
    let tokenIds = tokens.map((token) => token.id);
    BloodSplatterSocket.executeForEveryone("Splat", tokenIds);
  }

  static belowTreshold(actor) {
    const hpMax = BloodSplatter.getHpMax(actor.data);
    const hpVal = BloodSplatter.getHpVal(actor.data);
    if (
      (100 * hpVal) / hpMax <=
      game.settings.get("splatter", "bloodsplatterThreshold")
    )
      return true;
    return false;
  }

  static getHpVal(actorData) {
    return Object.byString(
      actorData,
      game.settings.get("splatter", "currentHp")
    );
  }
  static getHpMax(actorData) {
    return Object.byString(actorData, game.settings.get("splatter", "maxHp"));
  }
  static getCreatureType(actorData) {
    return Object.byString(
      actorData,
      game.settings.get("splatter", "creatureType")
    );
  }
  static getCreatureTypeCustom(actorData) {
    return Object.byString(
      actorData,
      game.settings.get("splatter", "creatureTypeCustom")
    );
  }

  static bloodTrail(wrapped, ...args) {
    if (!this.bleeding) {
      this.bleeding = true;
      setTimeout(() => {
        if (BloodSplatter.belowTreshold(this.actor)) {
          if (canvas.background.BloodSplatter) {
            canvas.background.BloodSplatter.SplatFromToken(
              this,
              Math.random() * 0.5
            );
          } else {
            new BloodSplatter();
            canvas.background.BloodSplatter.SplatFromToken(
              this,
              Math.random() * 0.5
            );
          }
        }
        this.bleeding = false;
      }, 100);
    }
    return wrapped(...args);
  }
}

let BloodSplatterSocket;

Hooks.once("socketlib.ready", () => {
  BloodSplatterSocket = socketlib.registerModule("splatter");
  BloodSplatterSocket.register("Splat", BloodSplatter.socketSplatFn);
});

Hooks.on("updateActor", async function (actor, updates) {
  if (!game.settings.get("splatter", "enableBloodsplatter")) return;
  let token = actor.parent
    ? canvas.tokens.get(actor.parent.id)
    : canvas.tokens.placeables.find((t) => t.actor.id == actor.id);
  const hpMax = BloodSplatter.getHpMax(actor.data);
  const oldHpVal = BloodSplatter.getHpVal(actor.data);
  const hpVal = BloodSplatter.getHpVal(updates);
  if (
    hpVal != undefined &&
    hpVal <= oldHpVal &&
    (100 * hpVal) / hpMax <=
      game.settings.get("splatter", "bloodsplatterThreshold")
  ) {
    if (!canvas.background.BloodSplatter) {
      new BloodSplatter();
      canvas.background.BloodSplatter.SplatFromToken(token);
    } else {
      canvas.background.BloodSplatter.SplatFromToken(token);
    }
  }
});

Hooks.on("canvasReady", function () {
  if (canvas.background.BloodSplatter)
    canvas.background.BloodSplatter.Destroy();
});
