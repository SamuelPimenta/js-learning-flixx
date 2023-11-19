const currentPage = window.location.pathname;
const links = document.getElementsByClassName("nav-link");

const highlightLink = () => {
  for (const link of links) {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  }
};

const init = () => {
  switch (currentPage) {
    case "/":
    case "/index.html":
      console.log("home");
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
