Hooks.once("init", function () {
  /**************************
   * BLOODSPLATTER SETTINGS *
   **************************/

  game.settings.register("splatter", "enableBloodsplatter", {
    name: game.i18n.localize("splatter.settings.enableBloodsplatter.text"),
    hint: game.i18n.localize("splatter.settings.enableBloodsplatter.hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: function (sett) {
      if (!sett && canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Destroy();
      }
      if (!sett) {
        libWrapper.unregister(
          "splatter",
          "Token.prototype._onMovementFrame",
          false
        );
      } else {
      if(game.settings.get("splatter", "enableBloodTrail")){
        libWrapper.register(
          "splatter",
          "Token.prototype._onMovementFrame",
          BloodSplatter.bloodTrail
        );
      }
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
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
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
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
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
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
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
      if (sett && game.settings.get("splatter", "enableBloodsplatter")) {
        libWrapper.register(
          "splatter",
          "Token.prototype._onMovementFrame",
          BloodSplatter.bloodTrail
        );
      } else {
        libWrapper.unregister(
          "splatter",
          "Token.prototype._onMovementFrame",
          false
        );
      }
    },
  });

  if (game.settings.get("splatter", "enableBloodTrail") === true && game.settings.get("splatter", "enableBloodsplatter")===true) {
    libWrapper.register(
      "splatter",
      "Token.prototype._onMovementFrame",
      BloodSplatter.bloodTrail
    );
  }

  game.settings.register("splatter", "useBloodsheet", {
    name: game.i18n.localize("splatter.settings.useBloodsheet.text"),
    hint: game.i18n.localize("splatter.settings.useBloodsheet.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: function () {
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
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
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
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
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
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
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
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
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "creatureType", {
    name: game.i18n.localize("splatter.settings.creatureType.text"),
    hint: game.i18n.localize("splatter.settings.creatureType.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "data.details.type.value",
  });

  game.settings.register("splatter", "creatureTypeCustom", {
    name: game.i18n.localize("splatter.settings.creatureTypeCustom.text"),
    hint: game.i18n.localize("splatter.settings.creatureTypeCustom.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "data.details.type.custom",
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
      if (canvas.background.BloodSplatter) {
        canvas.background.BloodSplatter.Update();
      }
    },
  });

  game.settings.register("splatter", "currentHp", {
    name: game.i18n.localize("splatter.settings.currentHp.text"),
    hint: game.i18n.localize("splatter.settings.currentHp.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "data.attributes.hp.value",
  });

  game.settings.register("splatter", "maxHp", {
    name: game.i18n.localize("splatter.settings.maxHp.text"),
    hint: game.i18n.localize("splatter.settings.maxHp.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "data.attributes.hp.max",
  });
});

Hooks.once("ready", function () {
  new window.Ardittristan.ColorSetting("splatter", "bloodColor", {
    name: game.i18n.localize("splatter.settings.bloodColor.text"),
    hint: game.i18n.localize("splatter.settings.bloodColor.hint"),
    label: game.i18n.localize("splatter.settings.bloodColor.label"),
    restricted: true,
    defaultColor: "#a51414d8",
    scope: "world",
    onChange: function () {
      if (canvas.background.Bloodsplatter) {
        canvas.background.Bloodsplatter.Update();
      }
    },
  });
});

Hooks.on("renderTokenConfig", (app, html, data) => {
  let bloodColor = app.object.getFlag("splatter", "bloodColor") || "";
  let newHtml = `<div class="form-group">
    <label>${game.i18n.localize("splatter.tokenconfig.bloodColor.name")}</label>
    <input type="text" name="flags.splatter.bloodColor" is="colorpicker-input" data-responsive-color value="${bloodColor}">
  </div> `;
  const tinthtml = html.find('input[name="tint"]');
  const formGroup = tinthtml.closest(".form-group");
  formGroup.after(newHtml);
  app.setPosition({ height: "auto" });
});

Hooks.on("getSceneControlButtons", (controls, b, c) => {
  controls
    .find((c) => c.name == "token")
    .tools.push(
      {
        name: "splatToken",
        title: game.i18n.localize("splatter.controls.splatToken.name"),
        icon: "fas fa-tint",
        button: true,
        visible:
          game.user.isGM &&
          game.settings.get("splatter", "enableBloodsplatter"),
        onClick: () => {
          if (!canvas.tokens.controlled[0]) {
            ui.notifications.warn(
              game.i18n.localize("splatter.controls.splatToken.warn")
            );
          } else {
            BloodSplatter.socketSplat(canvas.tokens.controlled);
          }
        },
      },
      {
        name: "clearBlood",
        title: game.i18n.localize("splatter.controls.clearBlood.name"),
        icon: "fas fa-tint-slash",
        button: true,
        visible: game.settings.get("splatter", "enableBloodsplatter"),
        onClick: () => {
          if (canvas.background.BloodSplatter)
            canvas.background.BloodSplatter.Destroy();
        },
      }
    );
});
