import assert from 'node:assert/strict';
import { test } from 'node:test';
import { geoToSvg, svgToGeo } from './vietnamMapProjection';
import { VIETNAM_34_PROVINCES } from '../data/vietnamMapData';

test('WGS84 Web Mercator GPS positions round trip with high fidelity', () => {
  for (const [lat, lng] of [[21.0285, 105.8542], [16.4637, 107.5909], [10.0452, 105.7469]]) {
    const point = geoToSvg(lat, lng);
    const restored = svgToGeo(point.x, point.y);
    assert.ok(Math.abs(restored.lat - lat) < 0.01, `lat error for ${lat}, ${lng}`);
    assert.ok(Math.abs(restored.lng - lng) < 0.01, `lng error for ${lat}, ${lng}`);
  }
});

test('all province centroids round trip through GPS within SVG rounding tolerance', () => {
  for (const province of VIETNAM_34_PROVINCES) {
    const geo = svgToGeo(province.cx, province.cy);
    const point = geoToSvg(geo.lat, geo.lng);
    assert.ok(Math.abs(point.x - province.cx) <= 0.2, `${province.id}: x`);
    assert.ok(Math.abs(point.y - province.cy) <= 0.2, `${province.id}: y`);
    assert.ok(geo.lat > 8 && geo.lat < 24, `${province.id}: latitude`);
    assert.ok(geo.lng > 101 && geo.lng < 111, `${province.id}: longitude`);
  }
});
