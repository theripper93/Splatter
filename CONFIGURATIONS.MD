
# PF1

| Field | Value |
|:---|:---|
| Creature Type | creatureType |
| Custom Creature Type | creatureType |
| Current HP | attributes.hp.offset |
| Max HP | attributes.hp.max |

Here's a script macro to setup some default colors for the different creature types found in pf1

```js
const bloodSheetData = {
  aberration: "#b527d5d5",
  animal: "#a51414d8",
  construct: "#5f4d39d5",
  dragon: "#40ab26d8",
  fey: "#b304add8",
  magicalBeast: "#b71e46d8",
  humanoid: "#a51414d8",
  monstrousHumanoid: "#810808d8",
  ooze: "#0000cc6d8",
  plant: "#195d09d8",
  undead: "#260000d8",
  outsider: "#b304add8",
  vermin: "#195d09d8",
};

game.settings.set("splatter", "BloodSheetData", bloodSheetData);
```

# PF2E

1. Module settings:

| Field | Value |
|:---|:---|
| Creature Type | traits.value |
| Custom Creature Type | traits.value |
| Current HP | attributes.hp.value |
| Max HP | attributes.hp.max |

2. Script macro to set default colors. (Remember that *Automatic Blood Color* must be enabled in the module's settings.)

```js
const BloodSheetData = {
  aberration: "#b527d5d5",
  beast: "#a51414d8",
  astral: "#463078d5",
  celestial: "#55a6cdd5",
  construct: "#5f4d39d5",
  dragon: "#40ab26d8",
  elemental: "#737373b1",
  fey: "#b304add8",
  fiend: "#b71e46d8",
  giant: "#541e1ed8",
  humanoid: "#a51414d8",
  monstrosity: "#810808d8",
  ooze: "#f3900fd8",
  plant: "#195d09d8",
  undead: "#260000d8",
  gnome: "#b304add8",
  android: "#5f4d39d5",
  anadi: "#195d09d8",
  automaton: "#b8ae72d5",
  conrasu: "#195d09d8",
};

game.settings.set("splatter", "BloodSheetData", BloodSheetData);
```

# ALIEN

1. Module settings:

| Field | Value |
|:---|:---|
| Creature Type | type |
| Custom Creature Type | type |
| Current HP | header.health.value |
| Max HP | header.health.max |

2. Script macro to set default colors: red for human blood, white-ish for synthetics' fluid, and green for xenomorph's acid. (Remember that *Automatic Blood Color* must be enabled in the module's settings.)

```js
const BloodSheetData = {
  character: "#a51414b0",
  creature: "#1dbb02b0",
  synthetic: "#f7f7f7b0",
};

game.settings.set("splatter", "BloodSheetData", bloodSheetData);
```


