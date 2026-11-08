/**
 * vietnamMapProjection.ts
 *
 * Official WGS84 Web Mercator projection calibrated for the 940 × 960 Vietnam Vector Map.
 * Provides bidirectional translation between real-world GPS coordinates (lat, lng)
 * and SVG canvas coordinates (x, y).
 */

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

// Calibrated coefficients for Mercator (EPSG:3857) projection on 940 x 960 canvas
const K_LNG = 2903.57;
const X_OFFSET = -5053.76;

const K_LAT = -2904.29;
const Y_OFFSET = 1290.24;

/**
 * Convert real-world GPS coordinates (WGS84 lat, lng) to Vietnam SVG Map canvas coordinates (x, y)
 */
export function geoToSvg(lat: number, lng: number): { x: number; y: number } {
  const radLng = lng * DEG2RAD;
  const radLat = lat * DEG2RAD;

  const x = K_LNG * radLng + X_OFFSET;
  const y = K_LAT * Math.log(Math.tan(Math.PI / 4 + radLat / 2)) + Y_OFFSET;

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

/**
 * Convert Vietnam SVG canvas coordinates (x, y) back to real-world GPS coordinates (lat, lng)
 */
export function svgToGeo(x: number, y: number): { lat: number; lng: number } {
  const radLng = (x - X_OFFSET) / K_LNG;
  const lng = radLng * RAD2DEG;

  const lnTerm = (y - Y_OFFSET) / K_LAT;
  const tanTerm = Math.exp(lnTerm);
  const radLat = 2 * (Math.atan(tanTerm) - Math.PI / 4);
  const lat = radLat * RAD2DEG;

  return {
    lat: Math.round(lat * 10000) / 10000,
    lng: Math.round(lng * 10000) / 10000,
  };
}
