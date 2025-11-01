// Динамическая галерея портфолио
// Для работы требуется структура: assets/img/portfolio/[серия]/[фото]
// Серии работ перечисляются вручную или через сервер (пример — вручную)


let portfolioSeries = [];

function fetchPortfolioSeries(callback) {
  fetch('assets/php/portfolio-list.php')
    .then(response => response.json())
    .then(data => {
      portfolioSeries = data;
      if (callback) callback();
    });
}

function renderPortfolioGallery(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  portfolioSeries.forEach(series => {
    if (!series.images.length) return;
    const previewImg = series.images[0];
    const galleryBlock = document.createElement('div');
    galleryBlock.className = 'col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-30';
    galleryBlock.innerHTML = `
      <div class="box snake mb-30">
        <div class="gallery-img small-img" style="background-image: url(assets/img/portfolio/${series.folder}/${previewImg});"></div>
        <figcaption>${series.name}</figcaption>
        <div class="overlay">
          <div class="overlay-content">
            <a href="#" onclick="openSeriesGallery('${series.folder}', '${series.name}'); return false;"><i class="ti-plus"></i></a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(galleryBlock);
  });
}

function renderHomeGallery(containerId, seriesList) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  seriesList.forEach(series => {
    if (!series.images.length) return;
    const previewImg = series.images[0];
    const galleryBlock = document.createElement('div');
    galleryBlock.className = 'col-xl-6 col-lg-6 col-md-6 col-sm-6';
    galleryBlock.innerHTML = `
      <div class="box snake mb-30">
        <div class="gallery-img small-img" style="background-image: url(assets/img/portfolio/${series.folder}/${previewImg});"></div>
        <figcaption>${series.name}</figcaption>
        <div class="overlay">
          <div class="overlay-content">
            <a href="portfolio.html"><i class="ti-plus"></i></a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(galleryBlock);
  });
}

function renderInstagramCarousel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  portfolioSeries.forEach(series => {
    if (!series.images.length) return;
    const previewImg = series.images[0];
    const carouselItem = document.createElement('div');
    carouselItem.className = 'single-instagram';
    carouselItem.innerHTML = `
      <img src="assets/img/portfolio/${series.folder}/${previewImg}" alt="${series.name}">
      <a href="portfolio.html"><i class="ti-instagram"></i></a>
    `;
    container.appendChild(carouselItem);
  });
}

function openSeriesGallery(folder, name) {
  // Открывает модальное окно с миниатюрами всех фото серии
  let modal = document.getElementById('portfolioModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'portfolioModal';
    modal.className = 'portfolio-modal';
    modal.innerHTML = '<div class="modal-content"><span class="close" onclick="closePortfolioModal()">&times;</span><div class="modal-title"></div><div class="modal-gallery"></div></div>';
    document.body.appendChild(modal);
  }
  modal.querySelector('.modal-title').textContent = name;
  const gallery = modal.querySelector('.modal-gallery');
  gallery.innerHTML = '';
  const series = portfolioSeries.find(s => s.folder === folder);
  if (series) {
    series.images.forEach(img => {
      const thumb = document.createElement('img');
      thumb.src = `assets/img/portfolio/${folder}/${img}`;
      thumb.className = 'portfolio-thumb';
      thumb.onclick = () => openFullImage(thumb.src);
      gallery.appendChild(thumb);
    });
  }
  modal.style.display = 'block';
}

function closePortfolioModal() {
  const modal = document.getElementById('portfolioModal');
  if (modal) modal.style.display = 'none';
}

function openFullImage(src) {
  let fullModal = document.getElementById('portfolioFullModal');
  if (!fullModal) {
    fullModal = document.createElement('div');
    fullModal.id = 'portfolioFullModal';
    fullModal.className = 'portfolio-full-modal';
    fullModal.innerHTML = '<div class="full-modal-content"><span class="close" onclick="closeFullImage()">&times;</span><img class="full-img" src=""></div>';
    document.body.appendChild(fullModal);
  }
  fullModal.querySelector('.full-img').src = src;
  fullModal.style.display = 'block';
}

function closeFullImage() {
  const fullModal = document.getElementById('portfolioFullModal');
  if (fullModal) fullModal.style.display = 'none';
}


// Для инициализации на странице portfolio.html:
// <div id="portfolioGallery"></div>
// <script src="assets/js/portfolio-gallery.js"></script>
// <script>fetchPortfolioSeries(() => renderPortfolioGallery('portfolioGallery'));</script>

// Для стилизации добавьте CSS для .portfolio-modal, .portfolio-thumb, .portfolio-full-modal и .full-img