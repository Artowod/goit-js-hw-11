import '../sass/main.scss';
import Notiflix from 'notiflix';
import axios from 'axios';
//import SimpleLightbox from 'simplelightbox';
//import 'simplelightbox/dist/simple-lightbox.min.css';

//Notiflix.Notify.success('Sol lucet omnibus');
//Notiflix.Notify.failure('Qui timide rogat docet negare');
//Notiflix.Notify.warning('Memento te hominem esse');
//Notiflix.Notify.info('Cogito ergo sum');

const sendParam = {
  key: '23763255-79cd913c0d73945049700542d',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
  page: 1,
};

async function getServerResponse(q = sendParam.q) {
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

const makeGalleryMarkup = function ({ data }) {
  const searchResult = data.hits;
  let galleryMarkup = '';
  const nedeedFields = searchResult.map(eachSingleResult => {
    galleryMarkup += makeOneCardMarkup(eachSingleResult);
  });
  return galleryMarkup;
};

const showGalleryMarkup = function (preparedMarkup) {
  document.querySelector('.gallery').insertAdjacentHTML('beforeend', preparedMarkup);
};

const stateReset = function () {
  document.querySelector('.load-more').disabled = false;
  document.querySelector('.load-more').style.display = 'none';
  sendParam.page = 1;
};

document.querySelector('.search-bar__search-form').addEventListener('submit', async e => {
  try {
    e.preventDefault();
    stateReset();
    const searchUserQuery = e.currentTarget.elements.searchQuery.value;
    const responseData = await getServerResponse(searchUserQuery);
    //или так    getServerResponse(searchUserQuery).then(({ data }) => {}
    Notiflix.Notify.success(`Hooray! We found ${responseData.data.totalHits} images!`);
    const galleryMarkupString = makeGalleryMarkup(responseData);
    document.querySelector('.gallery').innerHTML = '';
    showGalleryMarkup(galleryMarkupString);
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
    const galleryMarkupString = makeGalleryMarkup(responseData);
    showGalleryMarkup(galleryMarkupString);
  } catch (exception) {
    Notiflix.Notify.warning(exception);
    console.log(exception);
  }
});
