import "./style.css";

const searchInput = document.querySelector(".search");
const pagination = document.querySelector(".pagination");
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
      const html = `<li class="pagination-list-item item-${pageNumber}">${pageNumber}</li>`;
      pagination.insertAdjacentHTML("beforeend", html);
      pageNumber++;
    }
    pagination.querySelector(`.item-${this.getActivePage()}`);
    return paginatedCountries;
  }
}

const countriesManager = new CountriesManager();

async function jovan() {
  try {
    const response = await fetch(baseUrl + "all");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

countriesManager.setAllCountries(countriesManager.paginateCountries(jovan()));

console.log(countriesManager);
