const watch_mode = {
  cardMode: "card-mode",
  listMode: "list-mode"
};
const view = {
  dataPanel: document.querySelector("#data-panel"),
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#search-input"),
  paginator: document.querySelector("#paginator"),

  //渲染電影卡片模式至瀏覽器
  renderMovieCardList(...data) {
    let rawHTML = "";
    data.forEach((movie) => {
      rawHTML += `
        <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${model.POSTER_URL + movie.image}"
                class="card-img-top" alt="Movie Poster" />
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-dark btn-outline-light btn-show-movie " data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${movie.id
        }">
                  More
                </button>
                <button class="btn btn-light btn-outline-dark btn-add-favorite" data-id=${movie.id
        }>+</button>
              </div>
            </div>
          </div> 
        </div>
    `;
    });
    view.dataPanel.innerHTML = rawHTML;
  },

  //渲染電影條狀列表模式
  renderMovieBarList(...data) {
    let rawHTML = "";
    data.forEach((movie) => {
      rawHTML += `
         
    <li class="list-group-item">
      ${movie.title}
      <div>
      <button class="btn btn-primary btn-show-movie " data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${movie.id}">
        More
      </button>
      <button class="btn btn-info btn-add-favorite" data-id=${movie.id}>
        +
      </button>
      </div>
    </li>
    `;
    });
    view.dataPanel.innerHTML = rawHTML;
  },

  // 渲染分頁器
  renderPaginator(amount) {
    const numberOfPages = Math.ceil(amount / model.MOVIES_PER_PAGE);
    let rawHTML = "";
    for (let page = 1; page <= numberOfPages; page++) {
      if (page===model.currentPage){
        rawHTML += `<li class="page-item active"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`;
      }else {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`;
      }
    }
    view.paginator.innerHTML = rawHTML;
  },

  // 渲染電影詳細資訊
  showMovieModal(id) {
    const movieModal = document.querySelector("#movie-modal");
    const data = model.movies.find((movie) => movie.id === id);
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
                <img src="${model.POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">
              </div>
              <div class="col-sm-4 ">
                <p><em id="movie-modal-date">Release data: ${data.release_date
      }</em></p>
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
    `;
  },
  renderKeyword(keyword) {
    const result = document.querySelector('#result')
    if (keyword.length === 0) {
      result.innerText = ""
    } else {
      result.innerText = `${keyword} 的搜尋結果 : `
    }
  }
};

const model = {
  BASE_URL: "https://webdev.alphacamp.io",
  INDEX_URL: "https://webdev.alphacamp.io/api/movies/",
  POSTER_URL: "https://webdev.alphacamp.io/posters/",
  MOVIES_PER_PAGE: 12,
  movies: [],
  filteredMovies: [],
  currentMovies: [],
  currentPage: 1,

  // 讀取所有電影
  getAllMovieData() {
    axios.get(model.INDEX_URL).then((response) => {
      model.movies.push(...response.data.results);
      model.getMoviesByPage(Number(model.currentPage));
      controller.displayRender();
    });
  },
  // 加入最愛清單
  addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const movie = model.movies.find((movie) => movie.id === id);
    if (list.some((movie) => movie.id === id)) {
      return alert("已經收藏此電影");
    }
    list.push(movie);
    localStorage.setItem("favoriteMovies", JSON.stringify(list));
  },

  //取得當前頁面的電影清單
  getMoviesByPage(page) {
    const data = model.filteredMovies.length
      ? model.filteredMovies
      : model.movies; //若使用者有搜尋 (篩選電影>1) 就渲染篩選的電影:否則渲染一頁
    const startIndex = (page - 1) * model.MOVIES_PER_PAGE;
    const endIndex = startIndex + model.MOVIES_PER_PAGE;
    model.currentMovies = [];
    model.currentMovies.push(...data.slice(startIndex, endIndex)); //slice不含尾 不用-1
    console.log(model.currentMovies);
  }
};

const controller = {
  currentMode: watch_mode.cardMode,
  // 決定渲染
  displayRender() {
    const mode = controller.currentMode;
    const data = model.currentMovies;
    console.log(mode);
    console.log(data);
    switch (mode) {
      case watch_mode.cardMode:
        view.renderMovieCardList(...data);

        break;
      case watch_mode.listMode:
        view.renderMovieBarList(...data);

        break;
    }
    if (model.filteredMovies.length > 0) {
      view.renderPaginator(model.filteredMovies.length);
    } else {
      view.renderPaginator(model.movies.length);
    }
  },
  // 渲染信息 加入收藏
  showModal() {
    view.dataPanel.addEventListener("click", function onPanelClicked(event) {
      const id = Number(event.target.dataset.id);
      if (event.target.matches(".btn-show-movie")) {
        view.showMovieModal(id);
      } else if (event.target.matches(".btn-add-favorite")) {
        model.addToFavorite(id);
      }
    });
  },

  // 分頁器偵測器
  showAnotherPage() {
    view.paginator.addEventListener(
      "click",
      function onPaginatorClicked(event) {
        if (event.target.tagName !== "A") {
          //如果分頁器點到的不是<a> 就終止
          return;
        }
        const clickedPage = Number(event.target.dataset.page);
        model.currentPage = clickedPage;
        model.getMoviesByPage(clickedPage);
        controller.displayRender();
      }
    );
  },

  // 搜尋功能偵測器
  searchMovies() {
    view.searchForm.addEventListener(
      "submit",
      function onSearchFormSubmitted(event) {
        event.preventDefault();
        let keyString = String(view.searchInput.value)
        let keyword = view.searchInput.value.trim().toLowerCase();
        model.currentPage = 1;
        model.filteredMovies = model.movies.filter((movie) =>
          movie.title.toLowerCase().includes(keyword)
        );

        if (model.filteredMovies.length === 0) {
          alert(`找不到${keyword}`);
          return
        }
        model.getMoviesByPage(model.currentPage);
        //渲染第一頁 (搜尋 或原本)

        controller.displayRender();
        view.renderKeyword(keyString);
      }
    );
  },

  // 觀看模式偵測器
  switchWatchMode() {
    const ModeButton = document.querySelector("#btn-watch-mode");
    ModeButton.addEventListener(
      "click",
      function onWatchModeButtonClicked(event) {
        const mode = event.target.dataset.id;
        console.log(event.target.dataset.id);
        if (mode === controller.currentMode) {
          return;
        } else {
          controller.currentMode = mode;
        }
        controller.displayRender();
      }
    );
  }



};

model.getAllMovieData();

controller.showModal();
controller.showAnotherPage();
controller.searchMovies();
controller.switchWatchMode();
