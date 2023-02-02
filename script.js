const IMG_PATH = `https://image.tmdb.org/t/p/w1280`;
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=e00d91837043728a57896d1948c55a16&query="`;
const slider = document.querySelectorAll(".slider");
let API;

const input = document.querySelector(".input-search");
const search = document.querySelector(".search");
const btnSearch = document.querySelector(".btn-search");

const main = document.querySelector(".main");
const form = document.getElementById("form");
const searchForm = document.getElementById("search");

const imgTargets = document.querySelectorAll("img[data-src]");


btnSearch.addEventListener("click", function () {
  search.classList.toggle("active-search");
  input.focus();
});

const arrSlider = [...slider];

const APIMap = arrSlider.map((slider) => {
  return (API = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=e00d91837043728a57896d1948c55a16&page=${slider.dataset.slider}`);
});

async function getMovies(url) {
  return url.map(async function (url) {
    try {
      const res = await fetch(url);
      const data = await res.json();

      showMovies(data.results, data.page);
    } catch (err) {
      console.log(err);
    }
  });
}

getMovies(APIMap);

// setPages();

function showMovies(movies, page) {
  movies.forEach((movie) => {
    const { title, poster_path, vote_average } = movie;

    const markup = `
    <img src="${IMG_PATH + poster_path}" alt="${title}" class="img-slider">
    <div class="text-container">
    <span class="vote-average ${getClassByRate(
      vote_average
    )}">${vote_average}</span>
    </div>
    `;

    slider.forEach((slider) => {
      if (+slider.dataset.slider === page) {
        slider.insertAdjacentHTML("beforeend", markup);
      }
    });
  });
}

function getClassByRate(vote) {
  if (vote >= 7.5) {
    return `green`;
  } else if (vote >= 5) {
    return `orange`;
  } else {
    return `red`;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = searchForm.value;

  if (searchTerm && searchTerm !== "") {

    getMovies(SEARCH_API + searchTerm);

    searchForm.value = "";
  }
});

// Scrolling sticky NAV

// const navHeader = document.querySelector(".nav-header");
// const navHeight = navHeader.getBoundingClientRect().height;

// const initialCoords = navHeader.getBoundingClientRect();

// window.addEventListener("scroll", function (e) {
//   if (window.scrollY > initialCoords.height) {
//     navHeader.classList.add("sticky");
//   } else {
//     navHeader.classList.remove("sticky");
//   }
// });

document.addEventListener("click", (e) => {
  let handle;
  if (e.target.matches(".handle")) {
    handle = e.target;
  } else {
    handle = e.target.closest(".handle");
  }
  if (handle != null) onHandleClick(handle);
});

const throttleProgressBar = throttle(() => {
  document.querySelectorAll(".progress-bar").forEach(calculateProgressBar);
}, 250);
window.addEventListener("resize", throttleProgressBar);
window.addEventListener("mouseover", throttleProgressBar);

document.querySelectorAll("click").forEach(calculateProgressBar);

function calculateProgressBar(progressBar) {
  progressBar.innerHTML = "";
  const slider = progressBar.closest(".row").querySelector(".slider");

  const itemCount = slider.children.length / 2;

  const itemsPerScreen = parseInt(
    getComputedStyle(slider).getPropertyValue("--items-per-screen")
  );
  let sliderIndex = parseInt(
    getComputedStyle(slider).getPropertyValue("--slider-index")
  );
  const progressBarItemCount = Math.ceil(itemCount / itemsPerScreen);

  if (sliderIndex >= progressBarItemCount) {
    slider.style.setProperty("--slider-index", progressBarItemCount - 1);
    sliderIndex = progressBarItemCount - 1;
  }

  for (let i = 0; i < progressBarItemCount; i++) {
    const barItem = document.createElement("div");
    barItem.classList.add("progress-item");
    if (i === sliderIndex) {
      barItem.classList.add("active");
    }
    progressBar.append(barItem);
  }
}

function onHandleClick(handle) {
  const progressBar = handle.closest(".row").querySelector(".progress-bar");
  const slider = handle.closest(".container").querySelector(".slider");

  const sliderIndex = parseInt(
    getComputedStyle(slider).getPropertyValue("--slider-index")
  );

  const progressBarItemCount = progressBar.children.length;

  if (handle.classList.contains("left-handle")) {
    if (sliderIndex - 1 < 0) {
      slider.style.setProperty("--slider-index", progressBarItemCount - 1);
      progressBar.children[sliderIndex].classList.remove("active");
      progressBar.children[progressBarItemCount - 1].classList.add("active");
    } else {
      slider.style.setProperty("--slider-index", sliderIndex - 1);
      progressBar.children[sliderIndex].classList.remove("active");
      progressBar.children[sliderIndex - 1].classList.add("active");
    }
  }

  if (handle.classList.contains("right-handle")) {
    if (sliderIndex + 1 >= progressBarItemCount) {
      slider.style.setProperty("--slider-index", 0);
      progressBar.children[sliderIndex].classList.remove("active");
      progressBar.children[0].classList.add("active");
    } else {
      slider.style.setProperty("--slider-index", sliderIndex + 1);
      progressBar.children[sliderIndex].classList.remove("active");
      progressBar.children[sliderIndex + 1].classList.add("active");
    }
  }
}

function throttle(cb, delay = 1000) {
  let shouldWait = false;
  let waitingArgs;
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      cb(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };

  return (...args) => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    cb(...args);
    shouldWait = true;
    setTimeout(timeoutFunc, delay);
  };
}
