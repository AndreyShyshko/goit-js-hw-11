import './css/styles.css';
import imageCardTpl from './templates/image-card.hbs';
import ImagesApiService from './js/api-service';
import LoadMoreBtn from './js/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
};

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn();

loadMoreBtn.hide();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchQueryImages);

let hitsLengthSum;

async function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value;

  if (imagesApiService.query === '') {
    return errorQuery();
  }

  loadMoreBtn.hide();
  imagesApiService.resetPage();
  clearGalleryContainer();
  fetchQueryImages();
  loadMoreBtn.show();
  hitsLengthSum = 0;
  const { totalHits } = await imagesApiService.fetchImages();
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

async function fetchQueryImages() {
  const { hits, totalHits } = await imagesApiService.fetchImages();

  if (hits.length === 0) {
    return errorQuery();
  }

  hitsLengthSum += hits.length;
  console.log(hitsLengthSum);

  if (hitsLengthSum > totalHits) {
    loadMoreBtn.hide();
    return Notify.info("We're sorry, but you've reached the end of search results");
  }

  renderImageCard(hits);
}

function renderImageCard(images) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', imageCardTpl(images));
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function errorQuery() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again');
}
