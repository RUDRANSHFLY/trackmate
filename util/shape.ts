export const squareShape2D = [
  { x: 0, y: 0 },     // Your location
  { x: 0, y: 1 },     // Forward
  { x: 1, y: 1 },     // Right
  { x: 1, y: 0 },     // Back to side
  { x: 0, y: 0 },     // Close square
];


export const triangleShape2D = [
  { x: 0, y: 0 },      // Start (your location)
  { x: -0.5, y: 1 },   // Top left (forward and left)
  { x: 0.5, y: 1 },    // Top right (forward and right)
  { x: 0, y: 0 },      // Back to start
];


export const diamondShape2D = [
  { x: 0, y: 0 },      // Start (your location)
  { x: 0, y: 1 },      // Top
  { x: 1, y: 0 },      // Right
  { x: 0, y: -1 },     // Bottom
  { x: -1, y: 0 },     // Left
  { x: 0, y: 0 },      // Back to start (close shape)
];
