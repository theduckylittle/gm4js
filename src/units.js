const EQUIVALENT_METERS = {
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.347,
  in: 0.0254,
  m: 1,
  km: 1000,
  ch: 20.11684,
  a: 63.63,
  h: 100,
};

/** Converts numeric lengths between given units
 *
 * @param {number} length - Length
 * @param {string} srcUnits - Source unit
 * @param {string} destUnits - Destination unit
 * @return {number} Converted length
 */
export function convertLength(length, srcUnits, destUnits) {
  return (length * EQUIVALENT_METERS[srcUnits]) / EQUIVALENT_METERS[destUnits];
}

/** Converts numeric areas between given units
 *
 * @param {number} area - Area
 * @param {string} srcUnits - Source unit
 * @param {string} destUnits - Destination unit
 * @return {number} Converted area
 */
export function convertArea(area, srcUnits, destUnits) {
  // US survey feet, miles
  return (
    (area * Math.pow(EQUIVALENT_METERS[srcUnits], 2)) /
    Math.pow(EQUIVALENT_METERS[destUnits], 2)
  );
}
