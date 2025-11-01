// Динамическая галерея портфолио
// Для работы требуется структура: assets/img/portfolio/[серия]/[фото]
// Серии работ перечисляются вручную или через сервер (пример — вручную)


let portfolioSeries = [];

function fetchPortfolioSeries(callback) {
  console.log('Fetching portfolio data...');
  fetch('assets/php/portfolio-list.php')
    .then(response => {
      console.log('Portfolio API response status:', response.status);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Portfolio data received:', data);
      portfolioSeries = data;
      if (callback) callback();
    })
    .catch(error => {
      console.error('Error fetching portfolio data:', error);
      // Fallback to static data if API fails
      portfolioSeries = [
        {
          name: 'Арт',
          folder: 'Арт',
          images: []
        },
        {
          name: 'Городской вайб',
          folder: 'Городской вайб',
          images: []
        },
        {
          name: 'Портреты',
          folder: 'Портреты',
          images: []
        }
      ];
      if (callback) callback();
    });
}

function renderPortfolioGallery(containerId) {
  console.log('Rendering portfolio gallery for container:', containerId);
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }
  container.innerHTML = '';
  
  if (!portfolioSeries || portfolioSeries.length === 0) {
    console.warn('No portfolio series available');
    return;
  }
  
  console.log('Portfolio series to render:', portfolioSeries);
  
  portfolioSeries.forEach(series => {
    if (!series.images || !series.images.length) {
      console.log('Skipping series with no images:', series.name);
      return;
    }
    const previewImg = series.images[0];
    console.log('Rendering series:', series.name, 'with image:', previewImg);
    const galleryBlock = document.createElement('div');
    galleryBlock.className = 'col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-30';
    // Properly encode the URL for Cyrillic characters
    const encodedFolder = encodeURIComponent(series.folder);
    const encodedImage = encodeURIComponent(previewImg);
    console.log('Encoded folder:', encodedFolder, 'Encoded image:', encodedImage);
    galleryBlock.innerHTML = `
      <div class="box snake mb-30">
        <div class="gallery-img small-img" style="background-image: url(assets/img/portfolio/${encodedFolder}/${encodedImage});"></div>
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
  console.log('Rendering home gallery for container:', containerId);
  console.log('Series list to render:', seriesList);
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }
  container.innerHTML = '';
  
  if (!seriesList || seriesList.length === 0) {
    console.warn('No series list provided for home gallery');
    return;
  }
  
  seriesList.forEach(series => {
    if (!series.images || !series.images.length) {
      console.log('Skipping series with no images:', series.name);
      return;
    }
    const previewImg = series.images[0];
    console.log('Rendering series:', series.name, 'with image:', previewImg);
    const galleryBlock = document.createElement('div');
    galleryBlock.className = 'col-xl-6 col-lg-6 col-md-6 col-sm-6';
    // Properly encode the URL for Cyrillic characters
    const encodedFolder = encodeURIComponent(series.folder);
    const encodedImage = encodeURIComponent(previewImg);
    console.log('Encoded folder:', encodedFolder, 'Encoded image:', encodedImage);
    galleryBlock.innerHTML = `
      <div class="box snake mb-30">
        <div class="gallery-img small-img" style="background-image: url(assets/img/portfolio/${encodedFolder}/${encodedImage});"></div>
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
  console.log('Rendering Instagram carousel for container:', containerId);
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }
  container.innerHTML = '';
  
  if (!portfolioSeries || portfolioSeries.length === 0) {
    console.warn('No portfolio series available for carousel');
    return;
  }
  
  portfolioSeries.forEach(series => {
    if (!series.images || !series.images.length) {
      console.log('Skipping series with no images:', series.name);
      return;
    }
    const previewImg = series.images[0];
    const carouselItem = document.createElement('div');
    carouselItem.className = 'single-instagram';
    // Properly encode the URL for Cyrillic characters
    const encodedFolder = encodeURIComponent(series.folder);
    const encodedImage = encodeURIComponent(previewImg);
    carouselItem.innerHTML = `
      <img src="assets/img/portfolio/${encodedFolder}/${encodedImage}" alt="${series.name}">
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
      // Properly encode the URL for Cyrillic characters
      const encodedFolder = encodeURIComponent(folder);
      const encodedImage = encodeURIComponent(img);
      const thumb = document.createElement('img');
      thumb.src = `assets/img/portfolio/${encodedFolder}/${encodedImage}`;
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