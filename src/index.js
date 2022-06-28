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

  //   paginationForm: document.querySelector('.pagination-form'),
};
let startPage = 0;
let currentPage = 1;
const PAGINATION_PAGES = 10;
// console.log(refs.moviesDiv);
const API_BASE_URL = 'https://api.themoviedb.org/3/';
// https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>

const API_KEY = '06cf6ee022a0922eb5200ae030143d7b';
IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

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
  console.log(movies);
  console.log(movies.results);
  refs.moviesDiv.innerHTML = movies.results
    .map(movie => renderSingleMovie(movie))
    .join('');
  // console.log(renderPaginationPages());
  refs.paginationDiv.innerHTML = renderPaginationPages()
    .map(page => `<button type='submit' value='${page}'>${page}</button>`)
    .join('');
}

function renderSingleMovie(movie) {
  return ` <div class="col-4 col-lg-3 col-xl-2 p-1">
            <img src="${IMAGE_BASE_URL + movie.poster_path}" class="img-fluid" >
        </div>`;
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
