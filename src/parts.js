// DQ-style composable character parts
// Each value is a string of <rect> elements ONLY (no <svg>, no <g>)
// Coordinates use a 12×16 grid. Each part stays within its zone:
//   heads     : x=0-11, y=0-5
//   bodies    : x=2-9,  y=6-10
//   rightArms : x=9-11, y=5-10  (weapon may extend ABOVE the zone)
//   leftArms  : x=0-2,  y=5-10  (shield may extend)
//   legs      : x=2-9,  y=11-15

const r = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
const SKIN = '#f0c090';
const SKIN_DARK = '#c08060';

// ─── HEADS (zone: x=0-11, y=0-5) ─────────────────────────────────
const heads = {
  warrior: [
    // red helmet
    r(3,0,6,1,'#a02020'),
    r(2,1,8,1,'#c03030'),
    r(2,2,8,1,'#c03030'),
    r(2,2,8,1,'#ffd700').replace('fill="#ffd700"','fill="#ffd700"'), // (kept as is)
    // gold trim band
    r(2,2,8,1,'#ffd700'),
    // face
    r(3,3,6,3,SKIN),
    // eyes - sharp
    r(4,4,1,1,'#000'),
    r(7,4,1,1,'#000'),
    // mouth firm
    r(5,5,2,1,SKIN_DARK),
    // helmet side flares
    r(2,3,1,2,'#c03030'),
    r(9,3,1,2,'#c03030'),
  ].join(''),

  mage: [
    // pointy hat
    r(5,0,2,1,'#4020a0'),
    r(4,1,4,1,'#4020a0'),
    r(3,2,6,1,'#6030c0'),
    r(2,3,8,1,'#6030c0'),
    r(7,1,1,1,'#ffd700'), // star
    // face
    r(3,3,6,3,SKIN),
    r(4,4,1,1,'#000'),
    r(7,4,1,1,'#000'),
    r(5,5,2,1,SKIN_DARK),
  ].join(''),

  priest: [
    // hood
    r(3,0,6,1,'#80c0e0'),
    r(2,1,8,2,'#80c0e0'),
    r(2,1,1,2,'#60a0c0'),
    r(9,1,1,2,'#60a0c0'),
    // face
    r(3,3,6,3,SKIN),
    // gentle eyes (closed-ish)
    r(4,4,1,1,'#000'),
    r(7,4,1,1,'#000'),
    // soft smile
    r(5,5,2,1,'#a06060'),
  ].join(''),

  thief: [
    // bandana
    r(2,1,8,2,'#202020'),
    r(2,3,1,1,'#202020'),
    r(9,3,1,1,'#202020'),
    // bandana tail
    r(0,2,2,2,'#202020'),
    // face
    r(3,3,6,3,SKIN),
    // narrow eyes
    r(4,4,1,1,'#40ff40'),
    r(7,4,1,1,'#40ff40'),
    // smirk
    r(5,5,2,1,SKIN_DARK),
    r(7,5,1,1,'#000'),
  ].join(''),

  merchant: [
    // round hat
    r(3,0,6,1,'#a06030'),
    r(2,1,8,1,'#a06030'),
    r(1,2,10,1,'#604020'), // brim
    // hair sides
    r(2,3,1,1,'#604020'),
    r(9,3,1,1,'#604020'),
    // round face
    r(3,3,6,3,SKIN),
    // small dot eyes
    r(4,4,1,1,'#000'),
    r(7,4,1,1,'#000'),
    // smile
    r(5,5,2,1,SKIN_DARK),
  ].join(''),

  martial: [
    // hachimaki
    r(2,2,8,1,'#3a2010'),
    r(2,3,8,1,'#ff4040'),
    // hair tuft above
    r(4,1,4,1,'#202020'),
    r(5,0,2,1,'#202020'),
    // hachimaki tail
    r(9,2,1,2,'#ff4040'),
    r(10,3,1,1,'#ff4040'),
    // face
    r(3,4,6,2,SKIN),
    // sharp eyes
    r(4,4,1,1,'#000'),
    r(7,4,1,1,'#000'),
    // determined mouth
    r(5,5,2,1,'#000'),
  ].join(''),

  bard: [
    // hat
    r(3,1,6,1,'#c060a0'),
    r(2,2,8,1,'#c060a0'),
    // brim
    r(1,3,10,1,'#a04080'),
    // feather
    r(8,0,1,1,'#ffff40'),
    r(9,0,1,2,'#ffff80'),
    r(10,1,1,1,'#ffff40'),
    // face
    r(3,4,6,2,SKIN),
    // eyes
    r(4,4,1,1,'#000'),
    r(7,4,1,1,'#000'),
    // happy smile
    r(5,5,2,1,'#a04060'),
  ].join(''),

  sage: [
    // tall pointed hat
    r(5,0,2,1,'#2060c0'),
    r(4,1,4,1,'#2060c0'),
    r(3,2,6,1,'#4080e0'),
    r(2,3,8,1,'#4080e0'),
    // hat star
    r(6,1,1,1,'#ffd700'),
    // white hair sides
    r(2,3,1,2,'#e0e0e0'),
    r(9,3,1,2,'#e0e0e0'),
    // face
    r(3,4,6,2,SKIN),
    // wise eyes
    r(4,4,1,1,'#000'),
    r(7,4,1,1,'#000'),
    // beard hint
    r(4,5,4,1,'#e0e0e0'),
  ].join(''),

  other: [
    // hood
    r(3,0,6,1,'#606060'),
    r(2,1,8,2,'#808080'),
    r(2,1,1,2,'#606060'),
    r(9,1,1,2,'#606060'),
    // face
    r(3,3,6,3,SKIN),
    // simple eyes
    r(4,4,1,1,'#000'),
    r(7,4,1,1,'#000'),
    r(5,5,2,1,SKIN_DARK),
  ].join(''),
};

// ─── BODIES (zone: x=2-9, y=6-10) ────────────────────────────────
const bodies = {
  'cloth-armor': [
    r(2,6,8,1,'#c0a080'), // shoulders
    r(2,7,8,4,'#e0d0a0'), // body
    r(7,6,2,1,'#a08060'), // collar opening
    r(2,9,8,1,'#804020'), // belt
    r(7,9,2,1,'#ffd700'), // buckle
    r(2,7,1,3,'#c0a080'), // shadow left
    r(9,7,1,3,'#c0a080'), // shadow right
  ].join(''),

  'chain-armor': [
    r(2,6,8,1,'#606060'),
    r(2,7,8,4,'#a0a0a0'),
    r(2,9,8,1,'#404040'), // belt
    // chain dot pattern
    r(3,7,1,1,'#404040'),
    r(5,7,1,1,'#404040'),
    r(7,7,1,1,'#404040'),
    r(4,8,1,1,'#404040'),
    r(6,8,1,1,'#404040'),
    r(8,8,1,1,'#404040'),
    r(3,10,1,1,'#404040'),
    r(5,10,1,1,'#404040'),
    r(7,10,1,1,'#404040'),
    // highlight
    r(2,6,1,1,'#ffffff'),
    r(9,6,1,1,'#ffffff'),
  ].join(''),

  'dragon-armor': [
    r(2,6,8,1,'#206020'),
    r(2,7,8,4,'#40a040'),
    // gold trim
    r(2,6,8,1,'#206020'),
    r(2,7,8,1,'#ffd700'),
    // scale pattern
    r(3,8,1,1,'#80e080'),
    r(5,8,1,1,'#80e080'),
    r(7,8,1,1,'#80e080'),
    r(4,9,1,1,'#80e080'),
    r(8,9,1,1,'#80e080'),
    r(3,10,1,1,'#80e080'),
    r(7,10,1,1,'#80e080'),
    // gem center
    r(5,9,2,1,'#ff4040'),
    r(5,9,1,1,'#ff8080'),
    // gold belt
    r(2,10,8,1,'#ffd700'),
  ].join(''),

  default: [
    r(2,6,8,1,'#606060'),
    r(2,7,8,4,'#808080'),
    r(2,9,8,1,'#606060'), // belt-like
    r(2,7,1,3,'#606060'),
    r(9,7,1,3,'#606060'),
  ].join(''),
};

// ─── LEGS (zone: x=2-9, y=11-15) ─────────────────────────────────
const legs = {
  warrior: [
    r(2,11,3,3,'#c03030'),
    r(7,11,3,3,'#c03030'),
    r(2,11,3,1,'#ffd700'), // gold trim
    r(7,11,3,1,'#ffd700'),
    r(2,14,3,2,'#3a2010'), // black boots
    r(7,14,3,2,'#3a2010'),
    r(2,15,3,1,'#000'),
    r(7,15,3,1,'#000'),
  ].join(''),

  mage: [
    // robe flares out
    r(2,11,8,3,'#6030c0'),
    r(2,14,8,1,'#4020a0'),
    r(2,12,8,1,'#8050e0'), // robe highlight
    // gold trim
    r(2,15,8,1,'#ffd700'),
    // peeking boots
    r(3,15,1,1,'#3a2010'),
    r(8,15,1,1,'#3a2010'),
  ].join(''),

  priest: [
    r(2,11,8,3,'#a0d8f0'),
    r(2,12,8,1,'#c0e8ff'), // highlight
    r(2,14,8,1,'#80c0e0'),
    r(2,15,8,1,'#ffd700'), // gold hem
    // white shoes peek
    r(3,15,1,1,'#ffffff'),
    r(8,15,1,1,'#ffffff'),
  ].join(''),

  thief: [
    r(2,11,3,3,'#202020'),
    r(7,11,3,3,'#202020'),
    r(3,12,1,1,'#404040'), // highlight
    r(8,12,1,1,'#404040'),
    // light boots
    r(2,14,3,2,'#404040'),
    r(7,14,3,2,'#404040'),
    r(2,15,3,1,'#202020'),
    r(7,15,3,1,'#202020'),
  ].join(''),

  merchant: [
    r(2,11,3,3,'#a06030'),
    r(7,11,3,3,'#a06030'),
    r(3,12,1,1,'#c08040'), // highlight
    r(8,12,1,1,'#c08040'),
    // round shoes
    r(1,14,5,2,'#604020'),
    r(6,14,5,2,'#604020'),
    r(1,15,5,1,'#3a2010'),
    r(6,15,5,1,'#3a2010'),
  ].join(''),

  martial: [
    // gi pants - loose
    r(2,11,3,3,'#e08040'),
    r(7,11,3,3,'#e08040'),
    r(3,12,1,1,'#f0a060'),
    r(8,12,1,1,'#f0a060'),
    // hem
    r(2,13,3,1,'#c06020'),
    r(7,13,3,1,'#c06020'),
    // sandals (zori)
    r(2,14,3,1,SKIN), // bare feet
    r(7,14,3,1,SKIN),
    r(2,15,3,1,'#604020'), // straw soles
    r(7,15,3,1,'#604020'),
  ].join(''),

  bard: [
    // skirt flare
    r(2,11,8,3,'#e080c0'),
    r(2,12,8,1,'#f0a0d0'),
    r(2,14,8,1,'#a04080'),
    // ruffled hem
    r(2,15,2,1,'#ffff40'),
    r(5,15,2,1,'#ffff40'),
    r(8,15,2,1,'#ffff40'),
    r(4,15,1,1,'#a04080'),
    r(7,15,1,1,'#a04080'),
  ].join(''),

  sage: [
    r(2,11,8,3,'#4080e0'),
    r(2,12,8,1,'#80c0ff'),
    r(2,14,8,1,'#2060c0'),
    r(2,15,8,1,'#ffd700'),
    r(3,15,1,1,'#3a2010'),
    r(8,15,1,1,'#3a2010'),
  ].join(''),

  other: [
    r(2,11,3,3,'#808080'),
    r(7,11,3,3,'#808080'),
    r(2,14,3,2,'#404040'),
    r(7,14,3,2,'#404040'),
    r(2,15,3,1,'#202020'),
    r(7,15,3,1,'#202020'),
  ].join(''),
};

// ─── RIGHT ARMS (zone: x=9-11, y=5-10; weapon may extend up) ─────
const rightArms = {
  'wood-stick': [
    // arm
    r(9,6,2,4,SKIN_DARK),
    r(10,6,1,3,SKIN),
    // wooden stick - vertical
    r(11,1,1,8,'#a06030'),
    r(11,1,1,1,'#604020'), // tip
    r(11,4,1,1,'#604020'), // knot
    r(11,7,1,1,'#604020'), // grip
  ].join(''),

  'copper-sword': [
    // arm
    r(9,6,2,4,SKIN_DARK),
    r(10,6,1,3,SKIN),
    // diagonal sword
    r(11,2,1,1,'#ffe080'), // tip
    r(11,3,1,1,'#d08040'),
    r(10,4,1,1,'#d08040'),
    r(10,5,1,1,'#d08040'),
    r(11,5,1,1,'#ffe080'), // shine
    // guard
    r(9,6,3,1,'#ffd700'),
    // grip in hand
    r(10,6,1,1,'#604020'),
  ].join(''),

  'iron-sword': [
    r(9,6,2,4,SKIN_DARK),
    r(10,6,1,3,SKIN),
    // blade
    r(11,1,1,1,'#ffffff'),
    r(11,2,1,1,'#c0c0c0'),
    r(11,3,1,1,'#c0c0c0'),
    r(11,4,1,1,'#ffffff'),
    r(11,5,1,1,'#c0c0c0'),
    // guard
    r(9,6,3,1,'#a0a0a0'),
    r(10,6,1,1,'#3a2010'),
  ].join(''),

  'flame-sword': [
    r(9,6,2,4,SKIN_DARK),
    r(10,6,1,3,SKIN),
    // flame aura
    r(10,1,1,1,'#ffff40'),
    r(11,0,1,1,'#ff8040'),
    r(11,2,1,1,'#ffff40'),
    // blade
    r(11,1,1,1,'#ffff80'),
    r(11,2,1,1,'#ff6030'),
    r(11,3,1,1,'#ff4030'),
    r(11,4,1,1,'#ff6030'),
    r(11,5,1,1,'#ff4030'),
    // dragon guard
    r(9,6,3,1,'#ffd700'),
    r(10,6,1,1,'#604020'),
  ].join(''),

  'holy-sword': [
    r(9,6,2,4,SKIN_DARK),
    r(10,6,1,3,SKIN),
    // glow
    r(10,0,1,1,'#ffffc0'),
    r(11,1,1,1,'#ffffff'),
    r(10,3,1,1,'#ffffc0'),
    // golden blade
    r(11,0,1,1,'#ffffff'),
    r(11,1,1,1,'#ffffff'),
    r(11,2,1,1,'#ffd700'),
    r(11,3,1,1,'#ffe040'),
    r(11,4,1,1,'#ffd700'),
    r(11,5,1,1,'#ffe040'),
    // ornate guard
    r(9,6,3,1,'#ffd700'),
    r(10,6,1,1,'#ffffff'),
  ].join(''),

  default: [
    // bare arm + fist
    r(9,6,2,4,SKIN_DARK),
    r(10,6,1,3,SKIN),
    r(10,9,1,1,SKIN), // hand
    r(9,9,1,1,SKIN_DARK),
  ].join(''),
};

// ─── LEFT ARMS (zone: x=0-2, y=5-10; shield may extend) ──────────
const leftArms = {
  'wood-shield': [
    // arm behind shield
    r(1,6,2,4,SKIN_DARK),
    r(1,6,1,3,SKIN),
    // shield - wooden
    r(0,5,2,1,'#a06030'),
    r(0,6,2,5,'#a06030'),
    r(0,11,2,1,'#604020'),
    // wood grain
    r(0,7,2,1,'#804020'),
    r(0,9,2,1,'#804020'),
    // metal boss
    r(0,8,1,1,'#ffd700'),
  ].join(''),

  'iron-shield': [
    r(1,6,2,4,SKIN_DARK),
    r(1,6,1,3,SKIN),
    // metal kite shield
    r(0,5,2,1,'#c0c0c0'),
    r(0,6,2,4,'#a0a0a0'),
    r(0,10,2,1,'#808080'),
    r(1,11,1,1,'#808080'),
    // emblem
    r(0,7,1,2,'#ffd700'),
    // rivet highlights
    r(0,5,1,1,'#ffffff'),
    r(1,5,1,1,'#ffffff'),
  ].join(''),

  'magic-shield': [
    r(1,6,2,4,SKIN_DARK),
    r(1,6,1,3,SKIN),
    // glowing shield
    r(0,5,2,1,'#80c0ff'),
    r(0,6,2,5,'#4080e0'),
    r(0,11,2,1,'#2060c0'),
    // inner glow
    r(0,7,2,3,'#80c0ff'),
    // star center
    r(0,8,2,1,'#ffffff'),
    r(1,7,1,3,'#ffffff'),
    // sparkle
    r(0,5,1,1,'#ffffff'),
  ].join(''),

  default: [
    // bare arm
    r(0,6,2,4,SKIN_DARK),
    r(1,6,1,3,SKIN),
    r(1,9,1,1,SKIN), // hand
    r(0,9,1,1,SKIN_DARK),
  ].join(''),
};

window.DQ_PARTS = { heads, bodies, rightArms, leftArms, legs };
