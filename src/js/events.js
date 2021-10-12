import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {
  getServerResponse,
  makeGalleryMarkup,
  showGalleryMarkup,
  stateReset,
  scrollPageSmoothly,
} from './functions.js';

const gallery = new SimpleLightbox('.gallery a');

export const sendParam = {
  key: '23763255-79cd913c0d73945049700542d',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
  page: 1,
};

document.querySelector('.search-bar__search-form').addEventListener('submit', async e => {
  try {
    e.preventDefault();
    stateReset();
    const searchUserQuery = e.currentTarget.elements.searchQuery.value;
    const responseData = await getServerResponse(searchUserQuery);
    //или так    getServerResponse(searchUserQuery).then(({ data }) => {}
    Notiflix.Notify.success(`Hooray! We found ${responseData.data.totalHits} images!`);
    document.querySelector('.gallery').innerHTML = '';
    showGalleryMarkup(makeGalleryMarkup(responseData));
    gallery.refresh();
    document.querySelector('.load-more').style.display = 'block';
  } catch (exception) {
    Notiflix.Notify.failure(exception);
    console.log(exception);
  }
});

document.querySelector('.load-more').addEventListener('click', async e => {
  try {
    sendParam.page += 1;
    const responseData = await getServerResponse();
    showGalleryMarkup(makeGalleryMarkup(responseData));
    gallery.refresh();
    //---waiting a little bit before scrolling up until markup is shown at least partly.---
    setTimeout(() => scrollPageSmoothly(3), 300);
    //-------------------------------------------------------------------------------------
  } catch (exception) {
    Notiflix.Notify.warning(exception);
    console.log(exception);
  }
});
