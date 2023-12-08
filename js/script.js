const currentPage = window.location.pathname;
const links = document.getElementsByClassName("nav-link");
const API_URL = "https://api.themoviedb.org/3/";
const IMAGE_URL = "https://image.tmdb.org/t/p/original";
const API_KEY = "cf54935f8d3b7085181cfd876fcb3966";
const popularCards = document.getElementsByClassName("card");
const movieDetailsDiv = document.getElementById("movie-details");
const showDetailsDiv = document.getElementById("show-details");
const spinner = document.querySelector(".spinner");

const showSpinner = () => {
  spinner.classList.add("show");
};

const hideSpinner = () => {
  spinner.classList.remove("show");
};

const highlightLink = () => {
  for (const link of links) {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  }
};

const getData = async (page) => {
  try {
    showSpinner();
    const response = await fetch(API_URL + page + "?api_key=" + API_KEY);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    hideSpinner();

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

const formattedDate = (inputDateString) => {
  const date = new Date(inputDateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
const getImagePath = (maybeData) => {
  return maybeData ? IMAGE_URL + maybeData : "images/no-image.jpg";
};

const fillMovieCard = (card, data) => {
  const image = card.firstElementChild;
  image.setAttribute("href", "movie-details.html?id=" + data.id);
  const imagePath = getImagePath(data.poster_path);
  image.firstElementChild.setAttribute("src", IMAGE_URL + imagePath);
  image.firstElementChild.setAttribute("alt", data.original_title);
  card.children[1].firstElementChild.innerHTML = data.original_title;
  card.children[1].children[1].firstElementChild.innerHTML =
    "Release: " + formattedDate(data.release_date);
};

const getAndFillPopularMovies = async () => {
  const movies = await getData("movie/popular");
  for (let i = 0; i < popularCards.length; i++) {
    fillMovieCard(popularCards[i], movies.results[i]);
  }
};

const fillShowCard = (card, data) => {
  const image = card.firstElementChild;
  image.setAttribute("href", "tv-details.html?id=" + data.id);
  const imagePath = getImagePath(data.poster_path);
  image.firstElementChild.setAttribute("src", IMAGE_URL + imagePath);
  image.firstElementChild.setAttribute("alt", data.original_title);
  card.children[1].firstElementChild.innerHTML = data.name;
  card.children[1].children[1].firstElementChild.innerHTML =
    "Release: " + formattedDate(data.first_air_date);
};

const getAndFillPopularShows = async () => {
  const shows = await getData("tv/popular");
  for (let i = 0; i < popularCards.length; i++) {
    fillShowCard(popularCards[i], shows.results[i]);
  }
};
const getGenres = (data) => {
  let genres = "";
  for (const genre of data) {
    genres = genres + `<li>${genre.name}</li>`;
  }
  return genres;
};
const getProductionCompanies = (data) => {
  let productionCompanies = "";
  for (const productionCompany of data) {
    productionCompanies = productionCompanies + `${productionCompany.name}, `;
  }
  return productionCompanies.slice(0, -2);
};
const fillMovieDetails = (data) => {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `
  <div class="details-top">
          <div>
            <img
              src=${getImagePath(data.poster_path)}
              class="card-img-top"
              alt=${data.original_title}
            />
          </div>
          <div>
            <h2>${data.original_title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${data.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${formattedDate(
              data.release_date
            )}</p>
            <p>
            ${data.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${getGenres(data.genres)}
            </ul>
            <a href=${
              data.homepage
            } target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${data.budget.toLocaleString()}</li>
            <li><span class="text-secondary">Revenue:</span> $${data.revenue.toLocaleString()}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              data.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${data.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${getProductionCompanies(
            data.production_companies
          )}</div>
        </div>`;

  movieDetailsDiv.appendChild(newDiv);
};

const fillBackgroundImage = (imagePath) => {
  const divForBackground = document.createElement("div");
  divForBackground.classList.add("custom-background");
  divForBackground.style.backgroundImage = `url('${IMAGE_URL}${imagePath}')`;
  document.body.appendChild(divForBackground);
};

const getAndFillMovieDetails = async () => {
  const searchParams = new URLSearchParams(window.location.href);
  const movieId = searchParams.values().next().value;
  const movieDetails = await getData("movie/" + movieId);
  fillBackgroundImage(movieDetails.backdrop_path);
  fillMovieDetails(movieDetails);
};

const fillShowDetails = (data) => {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<div class="details-top">
  <div>
    <img
    src=${getImagePath(data.poster_path)}
    class="card-img-top"
    alt=${data.original_name}
    />
  </div>
  <div>
    <h2>${data.original_name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${data.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${formattedDate(
      data.first_air_date
    )}</p>
    <p>
    ${data.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
    ${getGenres(data.genres)}
    </ul>
    <a href=${data.homepage} target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${
      data.number_of_episodes
    }</li>
    <li>
      <span class="text-secondary">Last Episode To Air:</span> ${
        data.last_episode_to_air.name
      }
    </li>
    <li><span class="text-secondary">Status:</span> ${data.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${getProductionCompanies(
    data.production_companies
  )}</div>
</div>`;
  showDetailsDiv.appendChild(newDiv);
};

const getAndFillShowDetails = async () => {
  const searchParams = new URLSearchParams(window.location.href);
  const showId = searchParams.values().next().value;
  const showDetails = await getData("tv/" + showId);
  fillBackgroundImage(showDetails.backdrop_path);
  fillShowDetails(showDetails);
};

const init = () => {
  switch (currentPage) {
    case "/":
    case "/index.html":
    case "/index":
      getAndFillPopularMovies();
      break;
    case "/shows.html":
    case "/shows":
      getAndFillPopularShows();
      break;
    case "/movie-details.html":
    case "/movie-details":
      getAndFillMovieDetails();
      break;
    case "/tv-details.html":
    case "/tv-details":
      getAndFillShowDetails();
      break;
    case "/search.html":
      console.log("search");
      break;
  }
  highlightLink();
};

init();
