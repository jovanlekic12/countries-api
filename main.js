import "./style.css";

const searchInput = document.querySelector(".search");

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
}

const countriesManager = new CountriesManager();
