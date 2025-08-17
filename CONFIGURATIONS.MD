
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

2. Script macro to set default colors. (Remember that *Automatic Blood Color* must be enabled in the module's settings.) Based on data taken 2025/08/17

```js
const BloodSheetData = {
  Blight: "#5b4d0dcc",
  Duskwalker: "#999BC9D8",
  Ghul: "#444559D8",
  Kovintus: "#a51414d8",
  Paaridar: "#a51414d8",
  Sporeborn: "#B8AC93D8",
  Suli: "#a51414d8",
  Shade: "#260000D8",
  Anugobu: "#a51414d8",
  Centaur: "#a51414d8",
  Ghoran: "#0C2B04D8",
  Hantu: "#0C2B0400",
  Ikeshti: "#a51414d8",
  Lilu: "#520A0AD8",
  Merfolk: "#a51414d8",
  Munavri: "#a51414d8",
  Oread: "#767E9CD8",
  Stheno: "#a51414d8",
  Tanggal: "#4A1057D5",
  Undine: "#003DB8D5",
  Vanara: "#a51414d8",
  Wraithvine: "#A12596D5",
  Wyrwood: "#A1259600",
  Formian: "#B9D158D5",
  Grioth: "#8E86E1D8",
  Herald: "#8E86E100",
  Inevitable: "#8E86E100",
  Palinthanos: "#8E86E100",
  Sedacthy: "#590B0BD8",
  Shabti: "#a51414d8",
  Spriggan: "#590B0BD8",
  Sylph: "#3F3CD6D5",
  Bugbear: "#780F0FD8",
  Graveknight: "#2B0000D8",
  Morlock: "#A53F3FD8",
  Skulk: "#C24A4A36",
  Titan: "#a51414d8",
  Darvakka: "#260019D8",
  Siktempora: "#a51414d8",
  Asura: "#B71E46D8",
  Azarketi: "#a51414d8",
  Catfolk: "#a51414d8",
  Dhampir: "#a51414d8",
  Nagaji: "#a51414d8",
  Vishkanya: "#C95421D8",
  Anadi: "#2164C935",
  Grippli: "#a51414d8",
  Hobgoblin: "#7A0F0FD8",
  Seugathi: "#870BA3D5",
  Aesir: "#a51414d8",
  Azata: "#55A6CDD5",
  Hryngar: "#B33636D8",
  Kami: "#B3363600",
  Nindoru: "#8F1737D8",
  Oni: "#a51414d8",
  Serpentfolk: "#a51414d8",
  Skelm: "#a51414d8",
  Agathion: "#60D0E8D5",
  Alchemical: "#73F30FD8",
  Div: "#b71e46d8",
  Kaiju: "#8A0000D8",
  Phantom: "#8A000000",
  Qlippoth: "#b71e46d8",
  Tengu: "#a51414d8",
  Aeon: "#424242D5",
  Wraith: "#000000D5",
  Angel: "#FFFA7DD8",
  Changeling: "#a51414d8",
  Drow: "#6E14A5D8",
  Urdefhan: "#1457D9D8",
  Astral: "#463078d5",
  Acid: "#32b432f2",
  Rakshasa: "#a5141400",
  Caligni: "#260000D8",
  Fetchling: "#4D4D4DD8",
  Lizardfolk: "#a51414d8",
  Velstrac: "#691128D8",
  Archon: "#5DB6E0D5",
  Dero: "#690265D8",
  Illusion: "#69026500",
  Psychopomp: "#08010100",
  Sahkil: "#b71e46d8",
  Boggard: "#a51414d8",
  Ratfolk: "#a51414d8",
  Ethereal: "#a5141400",
  Time: "#a5141400",
  Nymph: "#b304add8",
  Protean: "#343791D5",
  Sprite: "#CC05C5D8",
  Werecreature: "#a51414d8",
  Daemon: "#a51414d8",
  Mummy: "#240404D8",
  Troll: "#080101D8",
  Arcane: "#a51414d8",
  Wight: "#240800D8",
  Dinosaur: "#a51414d8",
  Genie: "#a5141400",
  Xulgath: "#A54444D8",
  Dream: "#A5444400",
  Gremlin: "#CF05C8D8",
  Golem: "#CF05C800",
  Hag: "#a51414d8",
  Clockwork: "#a5141400",
  Soulbound: "#a5141400",
  Occult: "#40ab26d8",
  Electricity: "#ffff00d8",
  Ghost: "ffff0000",
  Vampire: "#360606D8",
  Devil: "#a51414d8",
  Kobold: "#a51414d8",
  Devil: "#a51414d8",
  Ghoul: "#260000d8",
  Celestial: "#55a6cdd5",
  Skeleton: "#55a6cd00",
  Cold: "#55a6cdd5",
  Ooze: "#f3900fd8",
  Orc: "#a51414d8",
  Zombie: "#260000d8",
  Divine: "#a5141400",
  Air: "#92cfffd1",
  Fungus: "#5D4E46D8",
  Giant: "#541e1ed8",
  Demon: "#a51414d8",
  Aquatic: "#a51414d8",
  Water: "#345985D8",
  Earth: "#5F3D18D5",
  Plant: "#195d09d8",
  Incorporeal: "#195d0900",
  Fire: "#FF5C00D5",
  Amphibious: "#a51414d8",
  Fey: "#b304add8",
  Dragon: "#40ab26d8",
  Elemental: "#737373B1",
  Aberration: "#b527d5d5",
  Beast: "#a51414d8",
  Fiend: "#b71e46d8",
  Construct: "#5f4d39d5",
  Mindless: "#a51414d8",
  Animal: "#a51414d8",
  Undead: "#260000d8",
  Humanoid: "#a51414d8",
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


