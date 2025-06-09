import { BloodSplatter } from "./BloodSplatter.js";
import { Socket } from "./lib/socket.js";

export const MODULE_ID = "splatter";

Hooks.once("init", function () {
  /**************************
   * SPLATTER DATA PATHS *
   **************************/

  const dataPaths = {
    dnd5e: {
      creatureType: "details.type.value",
      creatureTypeCustom: "details.type.custom",
      currentHp: "attributes.hp.value",
      maxHp: "attributes.hp.max",
      useWounds: false,
    },
    pf1e: {
      creatureType: "details.type.value",
      creatureTypeCustom: "details.type.custom",
      currentHp: "attributes.hp.value",
      maxHp: "attributes.hp.max",
      useWounds: false,
    },
    pf2e: {
      creatureType: "traits.value",
      creatureTypeCustom: "",
      currentHp: "attributes.hp.value",
      maxHp: "attributes.hp.max",
      useWounds: false,
    },
    sw5e: {
      creatureType: "details.type.value",
      creatureTypeCustom: "details.type.custom",
      currentHp: "attributes.hp.value",
      maxHp: "attributes.hp.max",
      useWounds: false,
    },
    alienrpg: {
      creatureType: "",
      creatureTypeCustom: "",
      currentHp: "header.health.value",
      maxHp: "header.health.max",
      useWounds: false,
    },
    yzecoriolis: {
      creatureType: "",
      creatureTypeCustom: "",
      currentHp: "hitPoints.value",
      maxHp: "hitPoints.max",
      useWounds: false,
    },
    swade: {
      creatureType: "",
      creatureTypeCustom: "",
      currentHp: "wounds.value",
      maxHp: "wounds.max",
      useWounds: true,
    },
    ds4: {
      creatureType: "baseInfo.creatureType",
      creatureTypeCustom: "",
      currentHp: "combatValues.hitPoints.value",
      maxHp: "combatValues.hitPoints.max",
      useWounds: false,
    },
    "cyberpunk-red-core": {
      creatureType: "",
      creatureTypeCustom: "",
      currentHp: "derivedStats.hp.value",
      maxHp: "derivedStats.hp.max",
      useWounds: false,
    },
    demonlord: {
      creatureType: "",
      creatureTypeCustom: "",
      currentHp: "characteristics.health.value",
      maxHp: "characteristics.health.max",
      useWounds: true,
    },
    avd12: {
      creatureType: "creature_type",
      creatureTypeCustom: "",
      currentHp: "health.value",
      maxHp: "health.max",
      useWounds: false,
    },
    wfrp4e: {
      creatureType: "details.species.value",
      creatureTypeCustom: "",
      currentHp: "status.wounds.value",
      maxHp: "status.wounds.max",
      useWounds: false,
    },
    deltagreen: {
      creatureType: "",
      creatureTypeCustom: "",
      currentHp: "health.value",
      maxHp: "health.max",
      useWounds: false,
    },
    shadowrun5e: {
      creatureType: "",
      creatureTypeCustom: "",
      currentHp: "track.physical.value",
      maxHp: "track.physical.max",
      useWounds: true,
    },
    lancer: {
      creatureType: "",
      creatureTypeCustom: "",
      currentHp: "hp.value",
      maxHp: "hp.max",
      useWounds: false,
    },
  };

  /**************************
   * BLOODSPLATTER SETTINGS *
   **************************/

  Socket.register("Splat", BloodSplatter.socketSplatFn);
  Socket.register("ClearAll", BloodSplatter.clearAll);

  globalThis.CONFIG.Splatter = {
    clearAll: () => Socket.ClearAll(),
    splat: (tokens) => {
      if (!Array.isArray(tokens)) tokens = [tokens];
      tokens = tokens.map((t) => t.document ?? t);
      Socket.Splat({ uuids: tokens.map((t) => t.uuid ?? t) });
    },
    saveBloodToTile: () => BloodSplatter.saveBlood(),
  };

  game.isAAPlaying = false;

  Hooks.on("aa.preAnimationStart", () => {
    game.isAAPlaying = true;
  });

  Hooks.on("aa.animationEnd", () => {
    game.isAAPlaying = false;
  });

  game.settings.register("splatter", "enableBloodsplatter", {
    name: game.i18n.localize("splatter.settings.enableBloodsplatter.text"),
    hint: game.i18n.localize("splatter.settings.enableBloodsplatter.hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: function (sett) {
      if (!sett && canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Destroy();
      }
    },
  });

  game.settings.register("splatter", "bloodColor", {
    name: game.i18n.localize("splatter.settings.bloodColor.text"),
    hint: game.i18n.localize("splatter.settings.bloodColor.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "#a51414d8",
    onChange: function () {
      if (canvas.primary.Bloodsplatter) {
        canvas.primary.Bloodsplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "violence", {
    name: game.i18n.localize("splatter.settings.violence.text"),
    hint: game.i18n.localize("splatter.settings.violence.hint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 1,
      max: 10,
      step: 1,
    },
    default: 1,
    onChange: function () {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "cleanup", {
    name: game.i18n.localize("splatter.settings.cleanup.text"),
    hint: game.i18n.localize("splatter.settings.cleanup.hint"),
    scope: "client",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 10,
      step: 1,
    },
    default: 0,
    onChange: function () {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "wallsBlockBlood", {
    name: game.i18n.localize("splatter.settings.wallsBlockBlood.text"),
    hint: game.i18n.localize("splatter.settings.wallsBlockBlood.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: function () {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "enableBloodTrail", {
    name: game.i18n.localize("splatter.settings.enableBloodTrail.text"),
    hint: game.i18n.localize("splatter.settings.enableBloodTrail.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: function (sett) {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "useBloodsheet", {
    name: game.i18n.localize("splatter.settings.useBloodsheet.text"),
    hint: game.i18n.localize("splatter.settings.useBloodsheet.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: function () {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "bloodsplatterThreshold", {
    name: game.i18n.localize("splatter.settings.bloodsplatterThreshold.text"),
    hint: game.i18n.localize("splatter.settings.bloodsplatterThreshold.hint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 1,
    },
    default: 50,
    onChange: function () {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "bloodsplatterScale", {
    name: game.i18n.localize("splatter.settings.bloodsplatterScale.text"),
    hint: game.i18n.localize("splatter.settings.bloodsplatterScale.hint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0.1,
      max: 2,
      step: 0.1,
    },
    default: 0.5,
    onChange: function () {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "bloodsplatterDelay", {
    name: game.i18n.localize("splatter.settings.bloodsplatterDelay.text"),
    hint: game.i18n.localize("splatter.settings.bloodsplatterDelay.hint"),
    scope: "world",
    config: true,
    type: Number,
    default: 500,
    onChange: function () {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "onlyInCombat", {
    name: game.i18n.localize("splatter.settings.onlyInCombat.text"),
    hint: game.i18n.localize("splatter.settings.onlyInCombat.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: function () {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });


  game.settings.register("splatter", "creatureType", {
    name: game.i18n.localize("splatter.settings.creatureType.text"),
    hint: game.i18n.localize("splatter.settings.creatureType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: dataPaths[game.system.id]?.creatureType ?? "",
  });

  game.settings.register("splatter", "creatureTypeCustom", {
    name: game.i18n.localize("splatter.settings.creatureTypeCustom.text"),
    hint: game.i18n.localize("splatter.settings.creatureTypeCustom.hint"),
    scope: "world",
    config: true,
    type: String,
    default: dataPaths[game.system.id]?.creatureTypeCustom ?? "",
  });

  game.settings.register("splatter", "BloodSheetData", {
    name: "",
    hint: "",
    scope: "world",
    config: false,
    type: Object,
    default: {
      aberration: "#b527d5d5",
      beast: "#a51414d8",
      celestial: "#55a6cdd5",
      construct: "#5f4d39d5",
      dragon: "#6a0e0ed8",
      elemental: "#737373b1",
      fey: "#afea44d8",
      fiend: "#b71e46d8",
      giant: "#541e1ed8",
      humanoid: "#a51414d8",
      monstrosity: "#810808d8",
      ooze: "#f3900fd8",
      plant: "#195d09d8",
      undead: "#440707d8",
    },
    onChange: function () {
      if (canvas.primary.BloodSplatter) {
        canvas.primary.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "currentHp", {
    name: game.i18n.localize("splatter.settings.currentHp.text"),
    hint: game.i18n.localize("splatter.settings.currentHp.hint"),
    scope: "world",
    config: true,
    type: String,
    default: dataPaths[game.system.id]?.currentHp ?? "attributes.hp.value",
  });

  game.settings.register("splatter", "maxHp", {
    name: game.i18n.localize("splatter.settings.maxHp.text"),
    hint: game.i18n.localize("splatter.settings.maxHp.hint"),
    scope: "world",
    config: true,
    type: String,
    default: dataPaths[game.system.id]?.maxHp ?? "attributes.hp.max",
  });

  game.settings.register("splatter", "useWounds", {
    name: game.i18n.localize("splatter.settings.useWounds.text"),
    hint: game.i18n.localize("splatter.settings.useWounds.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: dataPaths[game.system.id]?.useWounds ?? false,
  });
});

Hooks.once("ready", function () {
  canvas.app.ticker.add(BloodSplatter.bloodTrailTicker);
});

const renderTokenConfig = (app, html, data) => {
  let bloodColor = app.token.getFlag("splatter", "bloodColor") || "";
  let newHtml = `<div class="form-group">
    <label>${game.i18n.localize("splatter.tokenconfig.bloodColor.name")}</label>
    <div class="form-fields">
    <input type="text" name="flags.splatter.bloodColor" value="${bloodColor}">
    </div>
  </div> `;
  const tinthtml = html.querySelector('[name="texture.tint"]');
  const formGroup = tinthtml.closest(".form-group");
  formGroup.insertAdjacentHTML("afterend", newHtml);
  addColorPicker(
    html.querySelector(`[name="flags.splatter.bloodColor"]`),
    { opacity: true }
  );
  app.setPosition({ height: "auto" });
}

Hooks.on("renderTokenConfig", renderTokenConfig);
Hooks.on("renderPrototypeTokenConfig", renderTokenConfig);

Hooks.on("getSceneControlButtons", (controls, b, c) => {
  controls.tokens.tools.splatToken = {
    name: "splatToken",
    title: game.i18n.localize("splatter.controls.splatToken.name"),
    icon: "fas fa-tint",
    button: true,
    visible:
      game.user.isGM && game.settings.get("splatter", "enableBloodsplatter"),
    onChange: () => {
      if (!canvas.tokens.controlled[0]) {
        ui.notifications.warn(
          game.i18n.localize("splatter.controls.splatToken.warn")
        );
      } else {
        CONFIG.Splatter.splat(canvas.tokens.controlled);
      }
    },
  };
  controls.tokens.tools.clearBlood = {
    name: "clearBlood",
    title: game.i18n.localize("splatter.controls.clearBlood.name"),
    icon: "fas fa-tint-slash",
    button: true,
    visible: game.settings.get("splatter", "enableBloodsplatter"),
    onChange: () => {
      BloodSplatter.clearAll();
    },
  };
});

Hooks.on("preUpdateActor", function (actor, updates, diff) {
  diff.oldHpVal = BloodSplatter.getHpVal(actor);
});

Hooks.on("updateActor", function (actor, updates, diff) {
  if (
    !game.settings.get("splatter", "enableBloodsplatter") ||
    (game.settings.get("splatter", "onlyInCombat") && !game.combat?.started)
  )
    return;
  let token = actor.parent
    ? canvas.tokens.get(actor.parent.id)
    : canvas.tokens.placeables.find((t) => t.actor?.id == actor.id);
  if (!token) return;
  const impactScale = BloodSplatter.getImpactScale(actor, updates, diff);
  if (impactScale) BloodSplatter.executeSplat(token, impactScale);
});

Hooks.on("canvasReady", function () {
  if (canvas.primary.BloodSplatter) canvas.primary.BloodSplatter.Destroy();
});

Hooks.on("renderSettingsConfig", (app, html, data) => {
  addColorPicker(html.querySelector(`[name="splatter.bloodColor"]`), {opacity: true});
});

export function addColorPicker(input, {value, opacity = false } = {}) {
  const hexToComponents = (hex) => {
    const hexColor = hex.length < 9 ? hex + "f".repeat(9 - hex.length) : hex;

    const colorValue = hexColor.slice(0, 7);
    const alphaValue = parseInt(hexColor.slice(7, 9), 16) / 255;
    return { color: colorValue, alpha: alphaValue };
  };

  const componentsToHex = (color, alpha) => {
    const colorValue = color.replace("#", "");
    const alphaValue = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${colorValue}${alphaValue}`;
  };

  const textInput =
    input.type === "text" ? input : input.querySelector("input[type='text']");
  if (textInput.classList.contains("color-picker-added")) return;

  textInput.classList.add("color-picker-added");
  textInput.classList.add("color");
  const parent = textInput.parentElement;

  value ??= textInput.value || "#000000ff";

  const { color, alpha } = hexToComponents(value);

  const colorPickerElement = document.createElement("input");
  colorPickerElement.setAttribute("type", "color");
  if(opacity) colorPickerElement.style.maxWidth = "2rem";

  const alphaPickerHtml = `<range-picker min="0" max="1" step="0.01" value="${alpha}" data-tooltip="Alpha" style="min-width: 6rem;"></range-picker>`;
  const alphaPickerElement = new DOMParser()
    .parseFromString(alphaPickerHtml, "text/html")
    .querySelector("range-picker");

  const updateTextInput = (color, alpha) => {
    const hex = componentsToHex(color, alpha);
    if (!opacity) textInput.value = hex.slice(0, 7);
    else textInput.value = hex;
    textInput.dispatchEvent(new Event("change"));
  };

  colorPickerElement.value = color;
  alphaPickerElement.value = alpha;

  colorPickerElement.addEventListener("input", (event) => {
    const color = event.target.value;
    const alpha = alphaPickerElement.value;
    updateTextInput(color, alpha);
  });

  alphaPickerElement.addEventListener("input", (event) => {
    const alpha = event.target.value;
    const color = colorPickerElement.value;
    updateTextInput(color, alpha);
  });

  textInput.after(colorPickerElement);
  opacity && colorPickerElement.after(alphaPickerElement);
}
