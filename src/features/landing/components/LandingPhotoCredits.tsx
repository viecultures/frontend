const PHOTOS = [
  { title: 'Đèn lồng Hội An', file: 'Lanterns_in_Hoi_An_2.jpg', author: 'Christophe95', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { title: 'Cổng thành Huế', file: 'Citadel_Gate,_Imperial_City,_Huế_(7073473915).jpg', author: 'David McKelvey', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' },
  { title: 'Bánh mì', file: 'Banh_mi_sandwich.jpg', author: 'jeffreyw', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' },
  { title: 'Làng gốm Bát Tràng', file: 'Bat-Trang-Ceramic-Village13.jpg', author: 'Steven C. Price', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { title: 'Ruộng bậc thang Mù Cang Chải', file: 'Golden-terraced-fields-in-Mu-Cang-Chai.jpg', author: 'Malock2589', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  { title: 'Tranh Đông Hồ — Chuột rước đèn', file: 'Chuột_rước_đèn.JPG', author: 'Khuyết danh', license: 'Public domain', licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/' },
];

export const LandingPhotoCredits = () => (
  <details className="landing-container landing-photo-credits">
    <summary>Nguồn hình ảnh</summary>
    <p>Ảnh từ Wikimedia Commons, hiển thị theo khung cắt của giao diện; bản gốc giữ nguyên. Giấy phép dưới đây áp dụng cho từng ảnh.</p>
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
