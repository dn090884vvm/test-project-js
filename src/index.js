import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  inputForm: document.querySelector('#search-form'),
  inputField: document.querySelector('input'),
  searchButton: document.querySelector('button'),
  galleryItems: document.querySelector('.gallery'),
  continuouButton: document.querySelector('.load-more'),
  moviesDiv: document.querySelector('#movies'),
  paginationDiv: document.querySelector('#pagination'),
  preButton: document.querySelector('.previous'),
  nextButton: document.querySelector('.next'),
  movieCard: document.querySelector('.movie-card'),
  commonDiv: document.querySelector('.p-4'),

  //   paginationForm: document.querySelector('.pagination-form'),
};
let startPage = 0;
let currentPage = 1;
const PAGINATION_PAGES = 10;
// console.log(refs.moviesDiv);
const API_BASE_URL = 'https://api.themoviedb.org/3/';
// https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>

const API_KEY = '06cf6ee022a0922eb5200ae030143d7b';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
// const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function getPopularMovies() {
  let data = [];
  try {
    const response = await fetch(
      //   `${API_BASE_URL}movie/popular?api_key=${API_KEY}&page=${page}`
      `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&page=${currentPage}`
    );

    const responseData = await response.json();
    // console.log(
    //   'total pages=',
    //   responseData.total_pages,
    //   'total result=',
    //   responseData.total_results
    // );
    // console.log(responseData);
    //   data = responseData?.results;
    // data = responseData.results;
    data = responseData;
  } catch (error) {
    console.log(error);
  }
  return data;
}

async function renderMovies() {
  const movies = await getPopularMovies();
  console.log('this is movies=', movies);
  console.log('this is movies.result=', movies.results);

  // const additionalMovieInfo = await getCardInfo(movies.id);
  // console.log(additionalMovieInfo);

  refs.moviesDiv.innerHTML = movies.results
    .map(movie => renderSingleMovie(movie))
    .join('');

  // console.log(renderPaginationPages());
  refs.paginationDiv.innerHTML = renderPaginationPages()
    .map(page => `<button type='submit' value='${page}'>${page}</button>`)
    .join('');

  //   const modalWin = new SimpleLightbox('.photo-card a', {
  //     captionsData: 'alt',
  //     captionDelay: 250,
  //   });
}

function mapGenres(genres) {
  // console.log(genres);
  const genresList = genres.map(genre => `${genre.name}`).join(',');
  console.log(genresList);
  return genresList;
}

function renderSingleMovie(movie) {
  // const additionalMovieInfo = await getGenres(movie.id);
  // console.log(additionalMovieInfo);
  // console.log(movie.id);
  // await getAdditionalCardInfo(movie.id);
  // console.log(additionalMovieInfo);
  // const aaa = getGenres(movie.id).map(genres => `${genres}`.join(''));
  const aaa = '';
  getGenres(movie.id)
    .then(genres => mapGenres(genres))
    .then(list => console.log(list))
    .catch();
  let movieYear;
  if (movie.release_date) {
    movieYear = Number.parseInt(movie.release_date);
  } else {
    movieYear = Number.parseInt(movie.first_air_date);
  }

  if (movie.name) {
    return ` <div class="col-4 col-lg-3 col-xl-2 p-1">
            <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${
      movie.original_title
    }" id ="${movie.id}" class="img-fluid" ><p>${
      movie.name
    }</p><p>${movieYear}</p><p>${aaa}</p>
        </div>`;
  } else {
    return ` <div class="col-4 col-lg-3 col-xl-2 p-1">
            <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${
      movie.original_title
    }" id ="${movie.id}" class="img-fluid" ><p>${movie.original_title}</p>
    <p>${movieYear}</p><p>${aaa}</p>
        </div>`;
  }
}

function renderPaginationPages() {
  const array = [];
  for (let i = startPage; i < startPage + PAGINATION_PAGES; i += 1) {
    array.push(i + 1);
    // console.log(array);
  }
  //   console.log(array);
  return array;
}
// IMAGE_BASE_URL + movie?.poster_path;
function App(event) {
  event.preventDefault();
  renderMovies();
  refs.preButton.classList.remove('hidden');
  refs.nextButton.classList.remove('hidden');
  console.log(event.currentTarget.elements.searchQuery.value);
}
// App();
refs.inputForm.addEventListener('submit', App);
refs.paginationDiv.addEventListener('click', changePage);

function changePage(event) {
  //   console.log(event.target[2].value);

  event.preventDefault();
  console.log(event.target.value);
  currentPage = Number(event.target.value);

  renderMovies(currentPage);
  //   return Number(currentPage);

  if (currentPage % 10 === 0) {
    currentPage = currentPage - 10 + 1;
  } else {
    currentPage = Math.floor(currentPage - (currentPage % 10) + 1);
  }
  console.log(currentPage);
}

refs.nextButton.addEventListener('click', nextPages);
refs.preButton.addEventListener('click', prePages);

function nextPages() {
  //   console.log(currentPage);
  currentPage += 10;
  startPage += 10;
  console.log('current page=', currentPage);
  console.log('start page=', startPage);
  renderPaginationPages(startPage);
  renderMovies(currentPage);
}

function prePages() {
  //   console.log('current', currentPage);
  //   console.log('start', startPage);
  startPage -= 10;
  console.log('start page=', startPage);
  if (startPage < 0) {
    startPage = 0;
    // console.log('error');
    return;
  }
  currentPage -= 10;
  console.log('current page=', currentPage);
  renderPaginationPages(startPage);
  renderMovies(currentPage);
}

refs.moviesDiv.addEventListener('click', getMovieInfo);

function getMovieInfo(event) {
  console.log(event.target.id);
  renderMoviecard(event.target.id);
  //   const modalWin = new SimpleLightbox('.photo-card a', {
  //     captionsData: 'alt',
  //     captionDelay: 250,
  //   });
}

async function getGenres(filmID) {
  let data;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${filmID}?api_key=${API_KEY}&language=en-US`
    );

    const responseData = await response.json();

    data = responseData.genres;
  } catch (error) {
    console.log(error);
  }
  // console.log(data);
  return data;
}

async function getCardInfo(filmID) {
  let data;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${filmID}?api_key=${API_KEY}&language=en-US`
    );
    //   `${API_BASE_URL}movie/popular?api_key=${API_KEY}&page=${page}`
    //  `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&page=${currentPage}`

    const responseData = await response.json();
    // console.log(
    //   'total pages=',
    //   responseData.total_pages,
    //   'total result=',
    //   responseData.total_results
    // );
    // console.log(responseData);
    //   data = responseData?.results;
    // data = responseData.results;
    data = responseData;
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
  return data;
}

async function renderMoviecard(filmID) {
  const movieInfo = await getCardInfo(filmID);
  console.log(movieInfo);
  refs.movieCard.innerHTML = renderSingleMovieCard(movieInfo);
  //   refs.commonDiv.classList.add('hidden');
  //   const modalWin = new SimpleLightbox('.photo-card a', {
  //     captionsData: 'alt',
  //     captionDelay: 250,
  //   });
}
{
  /* <article class='col-4 col-lg-3 col-xl-2 p-1 photo-card'></article> */
}
function renderSingleMovieCard(movieInfo) {
  return `<article class='photo-card'><a href="${
    IMAGE_BASE_URL + movieInfo.poster_path
  }""><img src="${IMAGE_BASE_URL + movieInfo.poster_path}" alt="${
    movieInfo.original_title
  }" id ="${movieInfo.id}" class="img-fluid" >${
    movieInfo.overview
  }</a><article>`;
}

// function showImages(event) {
//   gettingImages(event);
// }

// function gettingImages(event) {
//   event.preventDefault();

//   const requestValue = refs.inputField.value;

//   getDatas()
//     .then(response => {
//       receivedDatas(response);
//     })
//     .catch(error => console.log(error.message));
// }