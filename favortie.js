const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// 渲染所有電影
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie " data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">
                More
              </button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
              
            </div>
          </div>
        </div> 
      </div>

  `
  })
  dataPanel.innerHTML = rawHTML
}

// 渲染電影詳細資訊
function showMovieModal(id) {
  const movieModal = document.querySelector('#movie-modal')
  const data = movies.find(movie => movie.id === id)
  movieModal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="movie-modal-title">
            ${data.title}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
          </button>
        </div>
        <div class="modal-body" id="movie-modal-body">
          <div class="row">
            <div class="col-sm-8" id="movie-modal-image">
              <img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">
            </div>
            <div class="col-sm-4 ">
              <p><em id="movie-modal-date">Release data: ${data.release_date}</em></p>
              <p id="movie-modal-description">${data.description}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  `
}

// 移除最愛清單
function removeFromFavorite(id) {

  if (!movies || !movies.length) return

  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return
  movies.splice(movieIndex,1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)

}


// 電影詳細資訊功能偵測器  + 收藏功能偵測器
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }

})


renderMovieList(movies)