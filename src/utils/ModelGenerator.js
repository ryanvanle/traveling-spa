import { CHARACTER_MODEL_OPTIONS } from "../Constants.js";

export function generateRandomHair() {
  const hair = {
    style: selectRandomElement(CHARACTER_MODEL_OPTIONS.hair.style),
    colorFill: selectRandomElement(CHARACTER_MODEL_OPTIONS.hair.color),
    colorStroke: selectRandomElement(CHARACTER_MODEL_OPTIONS.hair.colorStroke),
  };

  return hair;
}

export function generateRandomFeatures() {
  const features = {
    mouth: selectRandomElement(CHARACTER_MODEL_OPTIONS.mouth) + ".svg",
    eyes: selectRandomElement(CHARACTER_MODEL_OPTIONS.eyes) + ".svg",
    eyebrows: selectRandomElement(CHARACTER_MODEL_OPTIONS.eyebrows) + ".svg",
    skinColor: selectRandomElement(CHARACTER_MODEL_OPTIONS.skinColor) + ".svg",
  };

  return features;
}



function selectRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
