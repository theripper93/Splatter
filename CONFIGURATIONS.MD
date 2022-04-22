
# PF1

![image](https://user-images.githubusercontent.com/1346839/161739973-90180e30-4e59-426f-8d01-a6caf0ecc1a4.png)

Creature Type (and Custom): document.race.data.data.creatureType
Leave HP as is.

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
