import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_SERIES,
  ALL_SERIES_METADATA,
  ALL_SERIES_ARTICLES,
  getSeriesById,
  getSeriesByProvince,
  getSeriesArticle,
  getSeriesNavigation,
  PHO_SERIES_METADATA,
  BUN_CHA_SERIES_METADATA,
  CHA_CA_SERIES_METADATA,
  CA_KHO_VU_DAI_SERIES_METADATA,
  COM_CHAY_SERIES_METADATA,
  BANH_CAY_SERIES_METADATA,
  HUE_SERIES_METADATA,
  SAIGON_BANH_MI_METADATA,
} from './index';

describe('Article Series Mock Data Hub', () => {
  it('registers all series with valid metadata and non-empty chapters', () => {
    assert.ok(ALL_SERIES.length >= 8, 'At least 8 series registered');
    for (const series of ALL_SERIES) {
      assert.ok(series.metadata.id, 'Series must have id');
      assert.ok(series.metadata.title, 'Series must have title');
      assert.ok(series.metadata.provinceId, 'Series must have provinceId');
      assert.ok(series.metadata.chapters.length >= 3, 'Series must have at least 3 chapters');
      assert.equal(series.articles.length, series.metadata.chapters.length, 'Each chapter must have an article');
    }
  });

  it('resolves series by ID correctly', () => {
    const pho = getSeriesById('pho');
    assert.ok(pho);
    assert.equal(pho.metadata.id, PHO_SERIES_METADATA.id);

    const bunCha = getSeriesById('bun-cha');
    assert.ok(bunCha);
    assert.equal(bunCha.metadata.id, BUN_CHA_SERIES_METADATA.id);

    const chaCa = getSeriesById('cha-ca-la-vong');
    assert.ok(chaCa);
    assert.equal(chaCa.metadata.id, CHA_CA_SERIES_METADATA.id);

    const caKho = getSeriesById('ca-kho-vu-dai');
    assert.ok(caKho);
    assert.equal(caKho.metadata.id, CA_KHO_VU_DAI_SERIES_METADATA.id);

    const comChay = getSeriesById('com-chay-ninh-binh');
    assert.ok(comChay);
    assert.equal(comChay.metadata.id, COM_CHAY_SERIES_METADATA.id);

    const banhCay = getSeriesById('banh-cay-thai-binh');
    assert.ok(banhCay);
    assert.equal(banhCay.metadata.id, BANH_CAY_SERIES_METADATA.id);

    const hue = getSeriesById('hue-citadel');
    assert.ok(hue);
    assert.equal(hue.metadata.id, HUE_SERIES_METADATA.id);

    const banhMi = getSeriesById('saigon-banh-mi');
    assert.ok(banhMi);
    assert.equal(banhMi.metadata.id, SAIGON_BANH_MI_METADATA.id);

    assert.equal(getSeriesById('non-existent'), undefined);
  });

  it('filters series by province correctly', () => {
    const hanoiSeries = getSeriesByProvince('ha-noi');
    assert.ok(hanoiSeries.some(s => s.id === 'pho'));
    assert.ok(hanoiSeries.some(s => s.id === 'bun-cha'));
    assert.ok(hanoiSeries.some(s => s.id === 'cha-ca-la-vong'));

    const ninhBinhSeries = getSeriesByProvince('ninh-binh');
    assert.ok(ninhBinhSeries.some(s => s.id === 'ca-kho-vu-dai'));
    assert.ok(ninhBinhSeries.some(s => s.id === 'com-chay-ninh-binh'));

    const hungYenSeries = getSeriesByProvince('hung-yen');
    assert.ok(hungYenSeries.some(s => s.id === 'banh-cay-thai-binh'));

    const hueSeries = getSeriesByProvince('thua-thien-hue');
    assert.ok(hueSeries.some(s => s.id === 'hue-citadel'));

    const saigonSeries = getSeriesByProvince('ho-chi-minh');
    assert.ok(saigonSeries.some(s => s.id === 'saigon-banh-mi'));
  });

  it('resolves article by chapter ID across all registered series', () => {
    const phoArticle = getSeriesArticle('pho-hanoi-history');
    assert.ok(phoArticle);
    assert.equal(phoArticle.titleEn, 'Pho 01: The Kitchen Secrets Behind a Bowl of Phở');
    assert.ok(phoArticle.paragraphs.length > 0);
    assert.ok(phoArticle.vocabularies.length > 0);

    const bunChaArticle = getSeriesArticle('bun-cha-grilling-secrets');
    assert.ok(bunChaArticle);
    assert.equal(bunChaArticle.titleEn, 'Bún Chả 01: The Grilling Secrets of Traditional Bún Chả');
    assert.equal(bunChaArticle.vocabularies.length, 10);

    const chaCaArticle = getSeriesArticle('cha-ca-legend-history');
    assert.ok(chaCaArticle);
    assert.equal(chaCaArticle.titleEn, 'Chả Cá 01: Chả Cá Lã Vọng: A Dish Named After a Legend');
    assert.equal(chaCaArticle.vocabularies.length, 10);

    const caKhoArticle = getSeriesArticle('ca-kho-16-hour-secret');
    assert.ok(caKhoArticle);
    assert.equal(caKhoArticle.titleEn, 'Cá Kho 01: The 16-Hour Secret of Vũ Đại Braised Fish');
    assert.equal(caKhoArticle.vocabularies.length, 10);

    const comChayArticle = getSeriesArticle('com-chay-creative-origin');
    assert.ok(comChayArticle);
    assert.equal(comChayArticle.titleEn, 'Cơm Cháy 01: Cơm Cháy Ninh Bình: The Story of a Creative Youth');
    assert.equal(comChayArticle.vocabularies.length, 10);

    const banhCayArticle = getSeriesArticle('banh-cay-royal-gift');
    assert.ok(banhCayArticle);
    assert.equal(banhCayArticle.titleEn, 'Bánh Cáy 01: The Royal Gift from Làng Nguyễn');
    assert.equal(banhCayArticle.vocabularies.length, 10);

    const hueArticle = getSeriesArticle('hue-citadel-gate');
    assert.ok(hueArticle);
    assert.equal(hueArticle.titleEn, 'Hue 01: The Meridian Gate');

    const banhMiArticle = getSeriesArticle('banh-mi-crust');
    assert.ok(banhMiArticle);
    assert.equal(banhMiArticle.titleEn, 'Bánh Mì 01: The Crispy Crust');

    assert.equal(getSeriesArticle('unknown-chapter'), null);
  });

  it('computes accurate navigation links (previous, current, next) for chapters', () => {
    // First chapter in Pho series
    const navFirst = getSeriesNavigation('pho-hanoi-history');
    assert.ok(navFirst);
    assert.equal(navFirst.chapterIndex, 0);
    assert.equal(navFirst.previousChapter, null);
    assert.equal(navFirst.nextChapter?.id, 'pho-hanoi-flavour');
    assert.equal(navFirst.totalChapters, 3);

    // Middle chapter in Hue series
    const navMiddle = getSeriesNavigation('hue-citadel-forbidden-city');
    assert.ok(navMiddle);
    assert.equal(navMiddle.chapterIndex, 1);
    assert.equal(navMiddle.previousChapter?.id, 'hue-citadel-gate');
    assert.equal(navMiddle.nextChapter?.id, 'hue-citadel-music');

    // Last chapter in Banh Mi series
    const navLast = getSeriesNavigation('banh-mi-sidewalk');
    assert.ok(navLast);
    assert.equal(navLast.chapterIndex, 2);
    assert.equal(navLast.previousChapter?.id, 'banh-mi-fillings');
    assert.equal(navLast.nextChapter, null);

    assert.equal(getSeriesNavigation('non-existent'), null);
  });
});
