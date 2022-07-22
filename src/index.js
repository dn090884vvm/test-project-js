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
const ar = [];
async function renderMovies() {
  const movies = await getPopularMovies();
  console.log('this is movies=', movies);
  console.log('this is movies.result=', movies.results);

  movies.results.forEach(element => {
    ar.push(element.id);
  });
  console.log(ar);

  // const genres = await getGenres(movies.id);

  // const additionalMovieInfo = await getCardInfo(movies.id);
  // console.log(additionalMovieInfo);
  // console.log(array);
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
  // const array = [];
  // for (let i = 0; i < 2; i += 1) {
  //   array.push(genres.name[i]);
  // }
  const genresList = genres.map(genre => `${genre.name}`).join(',');
  // console.log(genresList);
  // const genresList = array.map(element => `${element}`).join(',');
  return genresList;
}

function renderSingleMovie(movie) {
  console.log(movie.id);
  // console.log(movie.genre_ids.length);
  // console.log('inside', genresList);
  console.log(movie.genre_ids);
  // const genresName = movie.genre_ids.map(el => genresList[el]);
  const genresName = [];
  movie.genre_ids.forEach(el => {
    if (genresList[el]) {
      genresName.push(genresList[el]);
    }
  });

  if (genresName.length === 0) {
    genresName.push('N/A');
  }
  if (genresName.length > 3) {
    genresName.splice(3);
    genresName[2] = 'Other';
  }
  console.log(genresName);

  const listOfGenres = genresName.map(el => `${el}`).join(', ');
  console.log(listOfGenres);
  // let listOfGenres = movie.genre_ids.map(el => `${el}`).join(',');
  // console.log(listOfGenres);
  // console.log(movie.genre_ids);

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
    }</p><p>${listOfGenres} | ${movieYear}</p>
        </div>`;
  } else {
    return ` <div class="col-4 col-lg-3 col-xl-2 p-1">
            <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${
      movie.original_title
    }" id ="${movie.id}" class="img-fluid" ><p>${movie.original_title}</p>
    <p>${listOfGenres} | ${movieYear}</p>
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
//========getting list of movies=====
const genresList = {};
getGenres().then(data => makingGenresList(data));

function makingGenresList(List) {
  List.forEach(el => {
    genresList[el.id] = el.name;
  });
}

console.log('eto', genresList);

//================

async function getGenres(filmID) {
  let data;
  try {
    const response = await fetch(
      // `https://api.themoviedb.org/3/movie/${filmID}?api_key=${API_KEY}&language=en-US`
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );

    const responseData = await response.json();
    // console.log(responseData);
    // data = responseData.genres.map(genre => genre.name).join(',');
    data = responseData.genres;
  } catch (error) {
    console.log(error);
  }
  // console.log('DATA IS', data);
  // array.push(data);
  // console.log(array);
  // return array;

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

async function getTrailer(filmID) {
  let data;
  try {
    const response = await fetch(
      // `https://api.themoviedb.org/3/movie/${filmID}?api_key=${API_KEY}&language=en-US`
      `https://api.themoviedb.org/3/movie/${filmID}/videos?api_key=${API_KEY}&language=en-US`
    );

    const responseData = await response.json();

    data = responseData;
  } catch (error) {
    console.log(error);
  }
  return data;
}

async function renderMoviecard(filmID) {
  const movieInfo = await getCardInfo(filmID);
  console.log('sdfsf', movieInfo);
  const trailer = await getTrailer(filmID);
  console.log('trailer is', trailer.results);

  let offTrailer;

  if (trailer.success === false) {
    console.log('AAAAAAA');
    offTrailer = 'n4rhAy3ueVE'; //cats video
  } else {
    // let offTrailer;
    const trailerResult = trailer.results.find(trailer => {
      if (
        trailer.name.includes('Official') ||
        trailer.name.includes('Trailer') ||
        trailer.name.includes('official') ||
        trailer.name.includes('trailer')
      ) {
        return trailer;
      } else if (
        trailer.name.includes('teaser') ||
        trailer.name.includes('Teaser')
      ) {
        return trailer;
      } else if (trailer.type === 'Trailer') {
        return trailer;
      }
    });

    console.log(trailerResult.key);
    offTrailer = trailerResult.key;
  }

  refs.movieCard.innerHTML = renderSingleMovieCard(movieInfo, offTrailer);
  //   refs.commonDiv.classList.add('hidden');
  //   const modalWin = new SimpleLightbox('.photo-card a', {
  //     captionsData: 'alt',
  //     captionDelay: 250,
  //   });
}
{
  /* <article class='col-4 col-lg-3 col-xl-2 p-1 photo-card'></article> */
}
function renderSingleMovieCard(movieInfo, offTrailer) {
  return `<article class='photo-card'><a href="${
    IMAGE_BASE_URL + movieInfo.poster_path
  }""><img src="${IMAGE_BASE_URL + movieInfo.poster_path}" alt="${
    movieInfo.original_title
  }" id ="${movieInfo.id}" class="img-fluid" >${
    movieInfo.overview
  }</a><article> 
  <iframe width="560" height="315" src="https://www.youtube.com/embed/${offTrailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
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

// Sergey Korobka, [11.07.2022 18:16]
// export async function createIframe(idMovie) {
//   showLoader();
//   const dataTrailer = await getTrailer(idMovie);

//   const trailerName = dataTrailer.results.find(trailer => {
//     const nameNormalized = trailer.name.toLowerCase();
//     const findArr = ['official', 'trailer', 'официальный', 'офіційний'];

//     const isIqual = findArr.some(el => nameNormalized.includes(el));

//     if (isIqual) {
//       return true;
//     } else {
//       return false;
//     }
//   });

//   const teaserName = dataTrailer.results.find(trailer => {
//     const nameNormalized = trailer.name.toLowerCase();
//     const findArr = ['teaser', 'тизер'];

//     const isIqual = findArr.some(el => nameNormalized.includes(el));

//     if (isIqual) {
//       return true;
//     } else {
//       return false;
//     }
//   });

//   const trailerType = dataTrailer.results.find(trailer => {
//     const nameNormalized = trailer.type.toLowerCase();
//     const find = 'trailer';

//     if (nameNormalized === find) {
//       return true;
//     } else {
//       return false;
//     }
//   });

//   const teaserType = dataTrailer.results.find(trailer => {
//     const nameNormalized = trailer.type.toLowerCase();
//     const find = 'teaser';

//     if (nameNormalized === find) {
//       return true;
//     } else {
//       return false;
//     }
//   });

//   const any = dataTrailer.results.find(el => el.key);

//   const trailer = trailerName  teaserName  trailerType  teaserType  any;

//   if (!trailer) {
//     notify('Sorry, trailer not found');
//     hideLoader();
//     return;
//   }

//   const markup = `
//   <iframe width="800" height="420" src="https://www.youtube.com/embed/${trailer.key}"
//     title="YouTube video player" frameborder="0"
//     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//     allowfullscreen>
//   </iframe>`;

//   modalTrailerRef.modalTrailer.innerHTML = markup;

//   hideLoader();
//   onOpenModal();
// }
