export const motionExamples = {
  linear: {
    title: "Linear Motion",
    description: "An object moving in a straight line at constant velocity",
    animate: (sphere, time) => {
      if (!sphere) return;
      sphere.position.x = Math.sin(time * 0.001) * 2;
      sphere.position.y = 0;
      sphere.position.z = 0;
    },
  },
  oscillation: {
    title: "Oscillation",
    description:
      "An object moving back and forth around an equilibrium position",
    animate: (sphere, time) => {
      if (!sphere) return;
      sphere.position.x = 0;
      sphere.position.y = Math.sin(time * 0.002) * 2;
      sphere.position.z = 0;
    },
  },
};
