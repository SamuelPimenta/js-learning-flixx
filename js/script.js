const currentPage = window.location.pathname;
const links = document.getElementsByClassName("nav-link");
const API_URL = "https://api.themoviedb.org/3/";
const IMAGE_URL = "https://image.tmdb.org/t/p/original";
const API_KEY = "cf54935f8d3b7085181cfd876fcb3966";
const popularMoviesCards = document.getElementsByClassName("card");

const highlightLink = () => {
  for (const link of links) {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  }
};

const getData = async (page) => {
  try {
    const response = await fetch(API_URL + page + "?api_key=" + API_KEY);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

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

const fillCard = (card, data) => {
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
  console.log(movies);
  for (let i = 0; i < popularMoviesCards.length; i++) {
    fillCard(popularMoviesCards[i], movies.results[i]);
    console.log(popularMoviesCards[i]);
  }
};

const init = () => {
  switch (currentPage) {
    case "/":
    case "/index.html":
      getAndFillPopularMovies();
      break;
    case "/shows.html":
      console.log("shows");
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
