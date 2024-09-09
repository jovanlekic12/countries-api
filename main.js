import "./style.css";

const searchInput = document.querySelector(".search");
const pagination = document.querySelector(".pagination");
const paginationContainer = document.querySelector(".pagination__container");
const countryList = document.querySelector(".grid-list");
const sort = document.querySelector(".sort");
window.addEventListener("load", function () {
  const loader = this.document.querySelector(".loader");
  loader.classList.add("loader-hidden");
});

let searchInputValue = "";
const baseUrl = `https://restcountries.com/v3.1/`;

searchInput.addEventListener(
  "input",
  (event) => (searchInputValue = event.target.value)
);

class CountriesManager {
  constructor() {
    this.allCountries = [];
    this.activePage = 1;
    this.activeCountries = [];
    this.selectedCountry = null;
  }

  setAllCountries(countries) {
    this.allCountries = countries;
  }

  getAllCountries() {
    return this.allCountries;
  }

  resetSelectedCountry() {
    this.selectedCountry = null;
  }

  setSelectedCountry(country) {
    this.selectedCountry = country;
  }

  getSelectedCountry() {
    return this.selectedCountry;
  }

  setActivePage(pageNumber) {
    this.activePage = pageNumber;
  }

  getActivePage() {
    return this.activePage;
  }

  resetActivePage() {
    this.activePage = 1;
  }

  setActiveCountries() {
    this.activeCountries = this.allCountries[this.activePage - 1];
  }

  getActiveCountries() {
    return this.activeCountries;
  }

  paginateCountries(countries) {
    const paginatedCountries = [];
    const chunkSize = 20;
    let pageNumber = 1;
    pagination.innerHTML = "";

    for (let i = 0; i < countries.length; i += chunkSize) {
      paginatedCountries.push(countries.slice(i, i + chunkSize));
      const html = `<li class="pagination__list__item item__${pageNumber}">${pageNumber}</li>`;
      pagination.insertAdjacentHTML("beforeend", html);
      pageNumber++;
    }
    pagination
      .querySelector(`.item__${this.getActivePage()}`)
      .classList.add("selected__page");
    return paginatedCountries;
  }
}

const countriesManager = new CountriesManager();

async function factoryFetch(url) {
  try {
    const response = await fetch(url);
    if (response.status !== 200) throw new Error("Something went wrong!");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function displayCountriesList(countries) {
  countryList.innerHTML = "";
  countries.forEach((country) => {
    const {
      flags: { png: image },
      name,
    } = country;
    const html = `<li class="country-list-item box__shadow">
                      <p class="list-country-name">${
                        name[Object.keys(name)[0]]
                      }</p>
                      <img src=${image} class="list-flag-image">
                    </li>`;
    countryList.insertAdjacentHTML("beforeend", html);
  });
}

factoryFetch(baseUrl + "all")
  .then((data) => {
    countriesManager.setAllCountries(countriesManager.paginateCountries(data));
    countriesManager.setActiveCountries();
    displayCountriesList(countriesManager.getActiveCountries());
  })
  .catch((error) => console.log(error));

pagination.addEventListener("click", (event) => {
  if (event.target.closest("li").classList.contains("pagination__list__item")) {
    const listItem = event.target.closest("li");
    pagination
      .querySelector(`.item__${countriesManager.getActivePage()}`)
      .classList.remove("selected__page");
    countriesManager.setActivePage(listItem.textContent);
    listItem.classList.add("selected__page");
    countriesManager.setActiveCountries();
    displayCountriesList(countriesManager.getActiveCountries());
  }
});
sort.addEventListener("input", (event) => {
  if (event.target.value === "all") {
    const url = baseUrl + event.target.value;
    factoryFetch(url)
      .then((data) => {
        countriesManager.resetActivePage();
        countriesManager.setAllCountries(
          countriesManager.paginateCountries(data)
        );
        countriesManager.setActiveCountries();
        displayCountriesList(countriesManager.getActiveCountries());
      })
      .catch((error) => console.log(error));
    return;
  }
  const url = baseUrl + `region/${event.target.value}`;
  factoryFetch(url)
    .then((data) => {
      countriesManager.resetActivePage();
      countriesManager.setAllCountries(
        countriesManager.paginateCountries(data)
      );
      countriesManager.setActiveCountries();
      displayCountriesList(countriesManager.getActiveCountries());
    })
    .catch((error) => console.log(error));
});

console.log(countriesManager);
