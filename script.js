// Get all the <p> elements with the class 'tab'
const tabs = document.querySelectorAll(".tab");
const listNames = document.querySelectorAll(".list-content .name");
const listCategories = document.querySelectorAll(
  ".list-content .list-category"
);
let page = document.querySelector(".page");
let activeTab = document.querySelector(".tab-active").textContent;
let searchString = "";
let [channelPage, moviePage, seriePage] = [0, 0, 0];
const perPage = 8;
let [moviesTotalPages, channelTotalPages, seriesTotalPages] = [];
let channel = fetchChannel;
let series = fetchSeries;
let movies = fetchMovies;

// Add a click event listener to each <p> element
ChangeContent();

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove the 'tab-active' class from all <p> elements
    tabs.forEach((tab) => {
      tab.classList.remove("tab-active");
    });

    // Add the 'tab-active' class to the clicked <p> element
    tab.classList.add("tab-active");
    activeTab = tab.textContent;
    ChangeContent();
  });
});

// change the data
const listNamesStyel = document.querySelectorAll(".name");
async function ChangeContent() {
  if (activeTab.toLocaleLowerCase() === "channels") {
    const data = await channel();
    channelTotalPages = Math.ceil(data.totalSize / perPage);
    page.textContent = `${channelPage + 1}`;
    listNames.forEach((e, i) => {
      e.textContent = data.content[i] ? data.content[i].name : "";
      e.setAttribute("title", data.content[i] ? data.content[i].name : "");
    });
    listNamesStyel.forEach((e) => {
      e.style.width = "50%";
    });

    listCategories.forEach((e, i) => {
      e.textContent = data.content[i] ? data.content[i].category : "";
      e.setAttribute("title", data.content[i] ? data.content[i].category : "");
    });
  } else if (activeTab.toLocaleLowerCase() === "series") {
    const data = await series();
    seriesTotalPages = Math.ceil(data.totalSize / perPage);
    page.textContent = `${seriePage + 1}`;
    listNames.forEach((e, i) => {
      e.textContent = data.content[i] ? data.content[i].name : "";
      e.setAttribute("title", data.content[i] ? data.content[i].name : "");
    });

    listNamesStyel.forEach((e) => {
      e.style.width = "80%";
    });

    listCategories.forEach((e, i) => {
      e.textContent = data.content[i] ? data.content[i].category : "";
      e.setAttribute("title", data.content[i] ? data.content[i].category : "");
    });
  } else {
    const data = await movies();
    moviesTotalPages = Math.ceil(data.totalSize / perPage);
    page.textContent = `${moviePage + 1}`;
    listNames.forEach((e, i) => {
      e.textContent = data.content[i] ? data.content[i].name : "";
      e.setAttribute("title", data.content[i] ? data.content[i].name : "");
    });
    listNamesStyel.forEach((e) => {
      e.style.width = "50%";
    });

    listCategories.forEach((e, i) => {
      e.textContent = data.content[i] ? data.content[i].category : "";
      e.setAttribute("title", data.content[i] ? data.content[i].category : "");
    });
  }
}

// fetch the data

async function fetchChannel() {
  const url = `https://sea-lion-app-jpxak.ondigitalocean.app/content/search?name=${searchString}&contentType=CHANNEL&page=${channelPage}&size=${perPage}`;
  // console.log(url);
  const req = await fetch(`${url}`);
  const res = await req.json();
  const data = await res;

  return data;
}
async function fetchSeries() {
  const url = `https://sea-lion-app-jpxak.ondigitalocean.app/content/search?name=${searchString}&contentType=SERIE&page=${seriePage}&size=${perPage}`;
  const req = await fetch(`${url}`);
  const res = await req.json();
  const data = await res;
  return data;
}
async function fetchMovies() {
  const url = `https://sea-lion-app-jpxak.ondigitalocean.app/content/search?name=${searchString}&contentType=MOVIE&page=${moviePage}&size=${perPage}`;
  const req = await fetch(`${url}`);
  const res = await req.json();
  const data = await res;
  return data;
}
// pagination
const nextPage = document.querySelector(".next");
const prevPage = document.querySelector(".previous");
nextPage.addEventListener("click", paginateNext);
prevPage.addEventListener("click", () => {
  if (+page.textContent === 1) {
    return;
  } else {
    return paginatePrev();
  }
});
//--------------
async function paginateNext() {
  // console.log(moviesTotalPages, channelTotalPages, seriesTotalPages);
  if (activeTab.toLocaleLowerCase() === "channels") {
    if (channelTotalPages - 1 <= channelPage) {
      return;
    }
    channelPage++;
    fetchChannel();
    page.textContent = `${+page.textContent + 1}`;
    ChangeContent();
  } else if (activeTab.toLocaleLowerCase() === "series") {
    if (seriesTotalPages - 1 <= seriePage) {
      return;
    }
    seriePage++;
    fetchSeries();
    page.textContent = `${+page.textContent + 1}`;
    ChangeContent();
  } else {
    if (moviesTotalPages - 1 <= moviePage) {
      return;
    }
    moviePage++;
    fetchMovies();
    page.textContent = `${+page.textContent + 1}`;
    ChangeContent();
  }
}
async function paginatePrev() {
  if (activeTab.toLocaleLowerCase() === "channels") {
    channelPage--;
    channel = fetchChannel();
    page.textContent = `${+page.textContent - 1}`;
    ChangeContent();
  } else if (activeTab.toLocaleLowerCase() === "series") {
    seriePage--;
    series = fetchSeries();
    page.textContent = `${+page.textContent - 1}`;
    ChangeContent();
  } else {
    moviePage--;
    movies = fetchMovies();
    page.textContent = `${+page.textContent - 1}`;
    ChangeContent();
  }
}

// searching
const search = document.getElementById("searching");
const searchIcon = document.getElementById("searchIcon");
const resetSearch = document.getElementById("resetSearch");

search.addEventListener("change", (e) => {
  searchString = e.target.value;
});
search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchString = e.target.value;
    console.log(searchString);
    ChangeContent();
  }
});
searchIcon.addEventListener("click", searchResult);
resetSearch.addEventListener("click", () => {
  searchString = "";
  search.value = "";
  console.log(search);
  ChangeContent();
});
async function searchResult() {
  // first we reset the pages
  [channelPage, moviePage, seriePage] = [0, 0, 0];
  page.textContent = "1";
  ChangeContent();
}
