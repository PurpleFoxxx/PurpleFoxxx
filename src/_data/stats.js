const achievements = require("./achievements.json");
const work = require("./work.json");

const podiums = achievements.filter((x) =>
  /^(1st|2nd|3rd)/i.test(x.rank),
).length;

module.exports = [
  {
    label: "Established",
    num: 2025,
    plain: true,
    desc: "Started in Mumbai as players. Evolved into builders.",
  },
  {
    label: "Client Deliveries",
    num: work.clientWork.length,
    plain: false,
    desc: "Custom lab builds across security firms and colleges.",
  },
  {
    label: "Podiums Earned",
    num: podiums,
    plain: false,
    desc: "Top-three finishes from our seasons on the board.",
  },
  {
    label: "Scoreboards",
    num: achievements.length,
    plain: false,
    desc: "National and college CTFs that shaped our instincts.",
  },
];
