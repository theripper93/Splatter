import { addColorPicker } from "./main.js";

export function registerBloodSheetConfig() {
  game.settings.registerMenu("splatter", "bloodSheetMenu", {
    name: game.i18n.localize("splatter.bloodSheet.menu.name"),
    label: game.i18n.localize("splatter.bloodSheet.menu.label"),
    hint: game.i18n.localize("splatter.bloodSheet.menu.hint"),
    icon: "fas fa-palette",
    type: BloodSheetConfig,
    restricted: true,
  });
}

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class BloodSheetConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "splatter-blood-sheet-config",
    tag: "form",
    window: {
      title: "splatter.bloodSheet.config.title",
      icon: "fas fa-palette",
      contentClasses: ["standard-form"],
      resizable: true,
    },
    position: { width: 560, height: "auto" },
    form: {
      handler: BloodSheetConfig._onSubmit,
      closeOnSubmit: true,
    },
    actions: {
      addRow: BloodSheetConfig._onAddRow,
      removeRow: BloodSheetConfig._onRemoveRow,
      resetDefaults: BloodSheetConfig._onResetDefaults,
    },
  };

  static PARTS = {
    form: {
      template: "modules/splatter/templates/blood-sheet-config.hbs",
      classes: ["standard-form", "scrollable"],
      scrollable: [""]
    },
    footer: {
      template: "templates/generic/form-footer.hbs"
    },
  };

  rows = Object.entries(game.settings.get("splatter", "BloodSheetData") ?? {}).map(([type, color]) => ({ type, color }));

  async _prepareContext() {
    return {
      rows: this.rows,
      buttons: [
        { type: "submit", icon: "fa-solid fa-save", label: "splatter.common.save" },
        { type: "button", icon: "fa-solid fa-plus", label: "splatter.bloodSheet.config.addRow", action: "addRow" },
        {
          type: "button",
          icon: "fa-solid fa-rotate-left",
          label: "splatter.bloodSheet.config.resetDefaults",
          action: "resetDefaults",
        },
      ],
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    for (const input of this.element.querySelectorAll('input[data-field="color"]')) {
      addColorPicker(input, { opacity: true });
    }
  }

  _readRows() {
    return [...this.element.querySelectorAll(".form-group")].map((row) => ({
      type: row.querySelector('[data-field="type"]').value.trim(),
      color: row.querySelector('[data-field="color"]').value.trim(),
    }));
  }

  static async _onAddRow() {
    this.rows = [...this._readRows(), { type: "", color: "#a51414d8" }];
    await this.render();
    const inputs = this.element.querySelectorAll('input[data-field="type"]');
    inputs[inputs.length - 1]?.focus();
  }

  static _onRemoveRow(event, target) {
    this.rows = this._readRows();
    this.rows.splice(Number(target.dataset.index), 1);
    this.render();
  }

  static _onResetDefaults() {
    const defaults = game.settings.settings.get("splatter.BloodSheetData").default;
    this.rows = Object.entries(defaults).map(([type, color]) => ({ type, color }));
    this.render();
  }

  static async _onSubmit() {
    const data = {};
    for (const { type, color } of this._readRows()) {
      if (type && color) data[type] = color;
    }
    await game.settings.set("splatter", "BloodSheetData", data);
  }
}
