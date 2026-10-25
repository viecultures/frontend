import test from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS_DATA } from '@/data/discoveryData';
import { getPageNumbers } from '../components/DictionaryPagination';
import { VOCABULARY_PAGE_SIZE } from './vocabulary-catalog';

test('getPageNumbers returns full page list when totalPages <= 7', () => {
  assert.deepEqual(getPageNumbers(1, 1), [1]);
  assert.deepEqual(getPageNumbers(1, 4), [1, 2, 3, 4]);
  assert.deepEqual(getPageNumbers(3, 4), [1, 2, 3, 4]);
  assert.deepEqual(getPageNumbers(4, 7), [1, 2, 3, 4, 5, 6, 7]);
});

test('getPageNumbers generates clean ellipsis when totalPages > 7', () => {
  // Near start
  assert.deepEqual(getPageNumbers(2, 10), [1, 2, 3, 4, 5, 'ellipsis', 10]);
  assert.deepEqual(getPageNumbers(4, 10), [1, 2, 3, 4, 5, 'ellipsis', 10]);

  // In middle
  assert.deepEqual(getPageNumbers(5, 10), [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  assert.deepEqual(getPageNumbers(6, 10), [1, 'ellipsis', 5, 6, 7, 'ellipsis', 10]);

  // Near end
  assert.deepEqual(getPageNumbers(7, 10), [1, 'ellipsis', 6, 7, 8, 9, 10]);
  assert.deepEqual(getPageNumbers(9, 10), [1, 'ellipsis', 6, 7, 8, 9, 10]);
  assert.deepEqual(getPageNumbers(10, 10), [1, 'ellipsis', 6, 7, 8, 9, 10]);
});

test('dictionary catalog pagination partitions LESSONS_DATA without overlaps or omissions', () => {
  const total = LESSONS_DATA.length;
  assert.ok(total > 0, 'LESSONS_DATA must not be empty');

  const totalPages = Math.max(1, Math.ceil(total / VOCABULARY_PAGE_SIZE));
  const collectedIds: string[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const start = (page - 1) * VOCABULARY_PAGE_SIZE;
    const pageItems = LESSONS_DATA.slice(start, start + VOCABULARY_PAGE_SIZE);

    assert.ok(pageItems.length > 0, `Page ${page} should have items`);
    assert.ok(pageItems.length <= VOCABULARY_PAGE_SIZE, `Page ${page} should not exceed page size`);

    for (const item of pageItems) {
      assert.ok(!collectedIds.includes(item.id), `Duplicate lesson found: ${item.id}`);
      collectedIds.push(item.id);
    }
  }

  assert.equal(collectedIds.length, total);
  assert.deepEqual(collectedIds, LESSONS_DATA.map((item) => item.id));
});

test('safe page clamps correctly when filtered list shrinks', () => {
  const calculateSafePage = (page: number, count: number, pageSize: number) => {
    const total = Math.max(1, Math.ceil(count / pageSize));
    return Math.min(page, total);
  };

  // User was on page 4, filtered results shrink to 5 items (1 page)
  assert.equal(calculateSafePage(4, 5, VOCABULARY_PAGE_SIZE), 1);
  // User was on page 4, filtered results shrink to 12 items (2 pages)
  assert.equal(calculateSafePage(4, 12, VOCABULARY_PAGE_SIZE), 2);
  // 0 items returns page 1
  assert.equal(calculateSafePage(3, 0, VOCABULARY_PAGE_SIZE), 1);
});
