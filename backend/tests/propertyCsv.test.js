const test = require('node:test');
const assert = require('node:assert');
const {
  parseBoolean,
  parseNumber,
  parseAmenities,
  mapRowToProperty,
} = require('../utils/propertyCsv');

test('parseNumber handles numbers, NA and blanks', () => {
  assert.strictEqual(parseNumber('42.5'), 42.5);
  assert.strictEqual(parseNumber('NA'), null);
  assert.strictEqual(parseNumber(''), null);
  assert.strictEqual(parseNumber('abc'), null);
});

test('parseBoolean maps CSV flags', () => {
  assert.strictEqual(parseBoolean('Y'), true);
  assert.strictEqual(parseBoolean('1'), true);
  assert.strictEqual(parseBoolean('N'), false);
  assert.strictEqual(parseBoolean('whatever'), false);
});

test('parseAmenities picks flagged columns', () => {
  assert.deepStrictEqual(parseAmenities({ Lift: 'Y', Park: '0', Gymnasium: '1' }), ['Lift', 'Gymnasium']);
});

test('mapRowToProperty maps core fields', () => {
  const p = mapRowToProperty({ ID: '7', bedroom: '2', Price: '5000000', City: 'Mumbai', latitude: '19.07', Longitude: '72.87' });
  assert.strictEqual(p.id, '7');
  assert.strictEqual(p.title, '2 BHK Flat');
  assert.strictEqual(p.price, 5000000);
  assert.strictEqual(p.city, 'Mumbai');
  assert.deepStrictEqual(p.coordinates, { lat: 19.07, lng: 72.87 });
});
