import "./style.css";

const themeIcon = document.querySelector(".theme__icon");
const searchInput = document.querySelector(".search");
const searchForm = document.querySelector(".form");
const pagination = document.querySelector(".pagination");
const countryList = document.querySelector(".grid-list");
const sort = document.querySelector(".sort");
const selectedCountry = document.querySelector(".selected-country");
const selectedCountryFlag = document.querySelector(".selected-country-flag");
const selectedCountryCapital = document.querySelector(".span-capital");
const selectedCountryCurrency = document.querySelector(".span-currency");
const selectedCountryLanguages = document.querySelector(".span-language");
const selectedCountryPopulation = document.querySelector(".span-population");
const selectedCountryName = document.querySelector(".span-name");
const overlay = document.querySelector(".overlay");
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

function displaySelectedCountry(
  image,
  capital,
  currency,
  language,
  population,
  name
) {
  selectedCountryFlag.src = image;
  selectedCountryCapital.textContent = capital;
  selectedCountryCurrency.textContent = currency;
  selectedCountryLanguages.textContent = language;
  selectedCountryPopulation.textContent = population;
  selectedCountryName.textContent = name;
  overlay.style.visibility = "visible";
  selectedCountry.style.visibility = "visible";
}

function displayCountriesList(countries) {
  countryList.innerHTML = "";
  countries.forEach((country) => {
    const {
      flags: { png: image },
      name,
    } = country;
    const html = `<li class="country-list-item box__shadow" data-name=${name[
      Object.keys(name)[0]
    ]
      .split(" ")
      .join("-")}>
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

countryList.addEventListener("click", (event) => {
  if (event.target.closest("li").getAttribute("data-name")) {
    const url =
      baseUrl +
      `name/${event.target
        .closest("li")
        .getAttribute("data-name")
        .split("-")
        .join(" ")}?fullText=true`;
    console.log(url, event.target.closest("li").getAttribute("data-name"));
    factoryFetch(url)
      .then((data) => {
        countriesManager.setSelectedCountry(data[0]);
        const {
          flags: { png: image },
          capital,
          currencies,
          languages,
          population,
          name,
        } = countriesManager.getSelectedCountry();
        displaySelectedCountry(
          image,
          capital,
          currencies[Object.keys(currencies)[0]].name,
          languages[Object.keys(languages)[0]],
          population,
          name[Object.keys(name)[0]]
        );
      })
      .catch((error) => console.log(error));
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = baseUrl + `name/${searchInputValue}?fullText=true`;
  factoryFetch(url)
    .then((data) => {
      countriesManager.setSelectedCountry(data[0]);
      const {
        flags: { png: image },
        capital,
        currencies,
        languages,
        population,
        name,
      } = countriesManager.getSelectedCountry();
      displaySelectedCountry(
        image,
        capital,
        currencies[Object.keys(currencies)[0]].name,
        languages[Object.keys(languages)],
        population,
        name[Object.keys(name)[0]]
      );
    })
    .catch((error) => console.log(error));
});

overlay.addEventListener("click", () => {
  overlay.style.visibility = "hidden";
  selectedCountry.style.visibility = "hidden";
  countriesManager.resetSelectedCountry();
});

themeIcon.addEventListener("click", function () {
  const items = document.querySelectorAll(".box__shadow");
  items.forEach((item) =>
    item.classList.contains("dark")
      ? item.classList.remove("dark")
      : item.classList.add("dark")
  );
});

console.log(countriesManager);
