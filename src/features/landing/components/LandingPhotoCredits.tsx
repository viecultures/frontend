import { useTranslation } from 'react-i18next';

interface PhotoItemConfig {
  key: 'hoi_an' | 'hue' | 'banh_mi' | 'bat_trang' | 'mu_cang_chai' | 'dong_ho';
  file: string;
  author: string;
  license: string;
  licenseUrl: string;
}

const PHOTOS_CONFIG: PhotoItemConfig[] = [
  { key: 'hoi_an', file: 'Lanterns_in_Hoi_An_2.jpg', author: 'Christophe95', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { key: 'hue', file: 'Citadel_Gate,_Imperial_City,_Huế_(7073473915).jpg', author: 'David McKelvey', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' },
  { key: 'banh_mi', file: 'Banh_mi_sandwich.jpg', author: 'jeffreyw', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' },
  { key: 'bat_trang', file: 'Bat-Trang-Ceramic-Village13.jpg', author: 'Steven C. Price', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { key: 'mu_cang_chai', file: 'Golden-terraced-fields-in-Mu-Cang-Chai.jpg', author: 'Malock2589', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  { key: 'dong_ho', file: 'Chuột_rước_đèn.JPG', author: 'Unknown', license: 'Public domain', licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' },
];

export const LandingPhotoCredits = () => {
  const { t } = useTranslation('landing');

  return (
    <details className="landing-container landing-photo-credits">
      <summary>{t('photo_credits.summary')}</summary>
      <p>{t('photo_credits.description')}</p>
      <ul>
        {PHOTOS_CONFIG.map((photo) => (
          <li key={photo.file}>
            <a href={'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(photo.file)} target="_blank" rel="noreferrer">
              {t(`photo_credits.items.${photo.key}`)}
            </a>
            {' — '}{photo.author}{' · '}
            <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>
          </li>
        ))}
      </ul>
    </details>
  );
};
