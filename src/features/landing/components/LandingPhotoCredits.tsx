const PHOTOS = [
  { title: 'Hoi An lanterns', file: 'Lanterns_in_Hoi_An_2.jpg', author: 'Christophe95', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { title: 'Hue Citadel gate', file: 'Citadel_Gate,_Imperial_City,_Huế_(7073473915).jpg', author: 'David McKelvey', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' },
  { title: 'Vietnamese bánh mì', file: 'Banh_mi_sandwich.jpg', author: 'jeffreyw', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' },
  { title: 'Bát Tràng pottery village', file: 'Bat-Trang-Ceramic-Village13.jpg', author: 'Steven C. Price', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { title: 'Mù Cang Chải rice terraces', file: 'Golden-terraced-fields-in-Mu-Cang-Chai.jpg', author: 'Malock2589', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  { title: 'Đông Hồ painting — Lantern procession', file: 'Chuột_rước_đèn.JPG', author: 'Unknown', license: 'Public domain', licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' },
];

export const LandingPhotoCredits = () => (
  <details className="landing-container landing-photo-credits">
    <summary>Image credits</summary>
    <p>Images sourced from Wikimedia Commons and cropped to fit the design; the originals are unchanged. Each image’s license is listed below.</p>
    <ul>
      {PHOTOS.map((photo) => (
        <li key={photo.file}>
          <a href={'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(photo.file)} target="_blank" rel="noreferrer">{photo.title}</a>
          {' — '}{photo.author}{' · '}
          <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>
        </li>
      ))}
    </ul>
  </details>
);
