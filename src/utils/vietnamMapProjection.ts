// Calibrated projection for the 520 × 1100 Vietnam SVG. Both directions must
// share these coefficients; a bounding-box interpolation is not equivalent.
const projection = {
  xLng: 55.5242, xLat: -0.3554, xOffset: -5609.5346,
  yLng: 4.3056, yLat: -61.6367, yOffset: 1040.9510,
};

export function geoToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = projection.xLng * lng + projection.xLat * lat + projection.xOffset;
  const y = projection.yLng * lng + projection.yLat * lat + projection.yOffset;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

/** Inverse affine projection; retains precision until the next SVG conversion. */
export function svgToGeo(x: number, y: number): { lat: number; lng: number } {
  const dx = x - projection.xOffset;
  const dy = y - projection.yOffset;
  const determinant = projection.xLng * projection.yLat - projection.xLat * projection.yLng;
  return {
    lng: (dx * projection.yLat - projection.xLat * dy) / determinant,
    lat: (projection.xLng * dy - dx * projection.yLng) / determinant,
  };
}
