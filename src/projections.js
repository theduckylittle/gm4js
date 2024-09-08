/**
 * EASE Grids are a super handy way to valid measurements
 * on planet earth, a neat paper is available here:
 *
 * - https://www.mdpi.com/2220-9964/1/1/32.
 */

// WGS84 Spheroid earth radius
const R = 6378137.0;
// Constant for global EASE Grid 2.0
const easePhi = 30 * (Math.PI / 180);

/**
 * Convert from lonLatToEaseGrid Coordinate.s
 */
export const lonLatToEaseGrid = ([lon, lat]) => {
  // convert from decimal degrees to global rads
  const phi = lat * (Math.PI / 180);
  const lambda = lon * (Math.PI / 180);

  const x = R * lambda * Math.cos(easePhi); // X coordinate
  const y = (R * Math.sin(phi)) / Math.cos(easePhi); // Y coordinate

  return [x, y];
};

export const easeGridToLonLat = ([x, y]) => {
  // convert from decimal degrees to global rads
  const phi = Math.asin((y * Math.cos(easePhi)) / R);
  const lambda = x / (R * Math.cos(easePhi));

  const lon = lambda * (180 / Math.PI); // Convert longitude to degrees
  const lat = phi * (180 / Math.PI); // Convert latitude to degrees

  return [lon, lat];
};
