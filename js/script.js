const currentPage = window.location.pathname;
const links = document.getElementsByClassName("nav-link");
const API_URL = "https://api.themoviedb.org/3/";
const IMAGE_URL = "https://image.tmdb.org/t/p/original";
const API_KEY = "cf54935f8d3b7085181cfd876fcb3966";
const popularCards = document.getElementsByClassName("card");
const spinner = document.querySelector(".spinner");

const showSpinner = () => {
  console.log(spinner);
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

const fillMovieCard = (card, data) => {
  const image = card.firstElementChild;
  image.setAttribute("href", "movie-details.html?id=" + data.id);
  const imagePath = data.poster_path
    ? IMAGE_URL + data.poster_path
    : "images/no-image.jpg";
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
  console.log(data);
  const image = card.firstElementChild;
  image.setAttribute("href", "tv-details.html?id=" + data.id);
  const imagePath = data.poster_path
    ? IMAGE_URL + data.poster_path
    : "images/no-image.jpg";
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

const init = () => {
  switch (currentPage) {
    case "/":
    case "/index.html":
      getAndFillPopularMovies();
      break;
    case "/shows.html":
      getAndFillPopularShows();
      break;
    case "/movie-details.html":
      console.log("movie details");
      break;
    case "/tv-details.html":
      console.log("tv details");
      break;
    case "/search.html":
      console.log("search");
      break;
  }
  highlightLink();
};

init();
