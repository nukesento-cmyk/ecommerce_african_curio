// Try to import local images, fallback to CDN URLs
let beads1, beads2, beads3, beads4, background, savanna, boutique, sunset;

try {
  beads1 = require("../images/beads.jpg");
} catch {
  beads1 = "https://images.unsplash.com/photo-1583119167560-9f6af1a9c1f1?w=800&h=1000&fit=crop&auto=format";
}

try {
  beads2 = require("../images/beads2.jpg");
} catch {
  beads2 = "https://images.unsplash.com/photo-1625764845146-6a2c9cb01e87?w=700&h=900&fit=crop&auto=format";
}

try {
  beads3 = require("../images/beads3.jpg");
} catch {
  beads3 = "https://images.unsplash.com/photo-1602614823959-0ab03cdb82ed?w=700&h=900&fit=crop&auto=format";
}

try {
  beads4 = require("../images/beads4.jpg");
} catch {
  beads4 = "https://images.unsplash.com/photo-1723578297503-78642a524074?w=800&h=700&fit=crop&auto=format";
}

try {
  background = require("../images/background.avif");
} catch {
  background = "https://images.unsplash.com/photo-1728042107033-76b13feac547?w=1920&h=1080&fit=crop&auto=format";
}

try {
  savanna = require("../images/savanna.avif");
} catch {
  savanna = background;
}

try {
  boutique = require("../images/boutique.avif");
} catch {
  boutique = background;
}

try {
  sunset = require("../images/sunset.avif");
} catch {
  sunset = background;
}

export const IMAGES = {
  savanna,
  maasaiWoman: beads1,
  beadedNecklace: beads2,
  maasaiFull: beads3,
  baskets: beads4,
  basketsMarket: beads2,
  woodenStatue: beads3,
  tribalMask: beads4,
  woodenStool: beads1,
  boutique,
  sunset,
};