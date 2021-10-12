import axios from 'axios';
import { sendParam } from './events.js';

export async function getServerResponse(q = sendParam.q) {
  sendParam.q = q;
  const response = await axios.get('https://pixabay.com/api/', {
    params: sendParam,
  });

  //  console.log(response.data.totalHits); //amount of pics (max 500) for free access.
  //  console.log(response.data.hits); //array of pics

  if (response.data.hits.length === 0 && sendParam.page === 1) {
    throw 'Sorry, there are no images matching your search query. Please try again.';
  }

  const allPagesAmount = Math.ceil(response.data.totalHits / sendParam.per_page);
  if (sendParam.page > allPagesAmount) {
    document.querySelector('.load-more').disabled = true;
    throw "We're sorry, but you've reached the end of search results.";
  }
  return response;
}

const makeOneCardMarkup = function ({
  webformatURL,
  largeImageURL,
  tags: alt,
  likes,
  views,
  comments,
  downloads,
}) {
  const oneCardMarkup = `
  <div class="photo-card">
  <a class = "gallery__item" href="${largeImageURL}">
  <img class="gallery__image" src="${webformatURL}" alt="${alt}" loading="lazy" width=350px/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
  return oneCardMarkup;
};

export const makeGalleryMarkup = function ({ data }) {
  const searchResult = data.hits;
  let galleryMarkup = '';
  const nedeedFields = searchResult.map(eachSingleResult => {
    galleryMarkup += makeOneCardMarkup(eachSingleResult);
  });
  return galleryMarkup;
};

export const showGalleryMarkup = function (preparedMarkup) {
  document.querySelector('.gallery').insertAdjacentHTML('beforeend', preparedMarkup);
};

export const stateReset = function () {
  document.querySelector('.load-more').disabled = false;
  document.querySelector('.load-more').style.display = 'none';
  sendParam.page = 1;
};
