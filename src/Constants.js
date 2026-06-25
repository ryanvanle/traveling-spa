export const ACTION_TYPES = {
  MOVE: "MOVE",
  INTERACT: "INTERACT"
}

export const CHARACTER_MODEL_OPTIONS = {
  eyes: ["eye-1"],
  eyebrows: ["eyebrow-1", "eyebrow-2", "eyebrow-3", "eyebrow-4", "eyebrow-5", "eyebrow-6"],
  skinColor: ["white", "brown", "yellow", "orange"],
  mouth: ["happy", "neutral", "slightly-happy", "slightly-sad", "sad"],
  hair: {
    style: [
      {
        front: { id: "front-1", width: "120%", top: "-5%", left: "-10%" },
        back:  { id: "back-1",  width: "120%", top: "-15%", left: "-10%" }
      },
      {
        front: { id: "front-2", width: "140%", top: "-10%", left: "-19.25%" },
        back:  { id: "back-2",  width: "105%", top: "-10%", left: "0%" }
      },
      {
        front: { id: "front-3", width: "125%", top: "-25%", left: "-12.5%" },
        back:  { id: "back-3",  width: "125%", top: "-10%", left: "-12.5%" }
      },
      {
        front: { id: "front-4", width: "125%", top: "-10%", left: "-12.5%" },
        back:  { id: "back-4",  width: "150%", top: "-25%", left: "-25%" }
      },
      {
        front: { id: "front-5", width: "140%", top: "-20%", left: "-20%" },
        back:  { id: "back-5",  width: "125%", top: "-10%", left: "-12.5%" }
      }
    ],
    color: ["black", "white", "red", "purple", "blue"],
    colorStroke: ["black", "white", "green"]
  }
};
