export const RSA_ID = "ripper-system-abstraction";

export const LEGACY_DATA_PATHS = {
  pf1: {
    creatureType: "details.type.value",
    creatureTypeCustom: "details.type.custom",
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
  yzecoriolis: {
    creatureType: "",
    creatureTypeCustom: "",
    currentHp: "hitPoints.value",
    maxHp: "hitPoints.max",
    useWounds: false,
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
  avd12: {
    creatureType: "creature_type",
    creatureTypeCustom: "",
    currentHp: "health.value",
    maxHp: "health.max",
    useWounds: false,
  },
  lancer: {
    creatureType: "",
    creatureTypeCustom: "",
    currentHp: "hp.value",
    maxHp: "hp.max",
    useWounds: false,
  },
  shadowrun5e: {
    creatureType: "",
    creatureTypeCustom: "",
    currentHp: "track.physical.value",
    maxHp: "track.physical.max",
    useWounds: true,
  },
  cairn2e: {
    creatureType: "",
    creatureTypeCustom: "",
    currentHp: "abilities.STR.value",
    maxHp: "abilities.STR.max",
    useWounds: false,
  },
};

export const LEGACY_SETTINGS = ["creatureType", "creatureTypeCustom", "currentHp", "maxHp", "useWounds"];

let rsa = null;
let ready = false;

export const SystemAdapter = {
  async init() {
    const api = game.modules.get(RSA_ID)?.API;
    if (api) {
      await api.ready;
      try {
        api.features.get();
        rsa = api;
      } catch {
        rsa = null;
      }
    }
    ready = true;
  },

  get isReady() {
    return ready;
  },

  get usesRSA() {
    return !!rsa;
  },

  getHealthPercent(actor) {
    if (!ready || !actor) return null;
    if (rsa) return rsa.health.getPercent(actor, { temporary: false });
    return legacyHealthPercent(actor);
  },

  getCreatureTypes(actor) {
    if (!actor) return [];
    let types = [];
    if (rsa) types = rsa.actor.getTypes(actor);
    else if (ready) types = legacyCreatureTypes(actor);
    return types.length ? types : [actor.type].filter(Boolean);
  },

  getAllCreatureTypes() {
    const types = new Set();
    if (rsa) {
      for (const { id } of rsa.actor.getAllTypes()) types.add(id);
    }
    for (const actor of game.actors) {
      for (const type of SystemAdapter.getCreatureTypes(actor)) types.add(type);
    }
    return [...types].filter((type) => typeof type === "string" && type.trim());
  },
};

function legacyValue(actor, setting) {
  const path = game.settings.get("splatter", setting);
  return path ? foundry.utils.getProperty(actor.system, path) : undefined;
}

function legacyHealthPercent(actor) {
  const max = Number(legacyValue(actor, "maxHp"));
  const value = legacyValue(actor, "currentHp");
  if (!(max > 0) || typeof value !== "number" || !Number.isFinite(value)) return null;
  const remaining = game.settings.get("splatter", "useWounds") ? max - value : value;
  return Math.clamp(remaining / max, 0, 1);
}

function legacyCreatureTypes(actor) {
  const type = legacyValue(actor, "creatureTypeCustom") || legacyValue(actor, "creatureType");
  const list = type instanceof Set ? [...type] : Array.isArray(type) ? type : [type];
  return list.filter((entry) => typeof entry === "string" && entry);
}
