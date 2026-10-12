import assert from 'node:assert/strict';
import { test } from 'node:test';
import { geoToSvg, svgToGeo } from './vietnamMapProjection';
import { VIETNAM_34_PROVINCES } from '../data/vietnamMapData';

test('existing calibrated GPS positions remain unchanged', () => {
  for (const [lat, lng] of [[21.0285, 105.8542], [16.4637, 107.5909], [10.0452, 105.7469]]) {
    assert.deepEqual(geoToSvg(lat, lng), {
      x: Math.round((55.5242 * lng - 0.3554 * lat - 5609.5346) * 10) / 10,
      y: Math.round((4.3056 * lng - 61.6367 * lat + 1040.9510) * 10) / 10,
    });
    const point = geoToSvg(lat, lng);
    const restored = svgToGeo(point.x, point.y);
    assert.ok(Math.abs(restored.lat - lat) < 0.001);
    assert.ok(Math.abs(restored.lng - lng) < 0.001);
  }
});

test('all province centroids round trip through GPS within SVG rounding tolerance', () => {
  for (const province of VIETNAM_34_PROVINCES) {
    const geo = svgToGeo(province.cx, province.cy);
    const point = geoToSvg(geo.lat, geo.lng);
    assert.ok(Math.abs(point.x - province.cx) <= 0.051, `${province.id}: x`);
    assert.ok(Math.abs(point.y - province.cy) <= 0.051, `${province.id}: y`);
    assert.ok(geo.lat > 8 && geo.lat < 24, `${province.id}: latitude`);
    assert.ok(geo.lng > 101 && geo.lng < 111, `${province.id}: longitude`);
  }
});
