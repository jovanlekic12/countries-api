import "./style.css";

window.addEventListener("load", function () {
  const loader = this.document.querySelector(".loader");
  loader.classList.add("loader-hidden");
});

class Countries {
  constructor() {
    this.countries = [];
  }
  addCountries(country) {
    this.countries.push(country);
  }
  setCountries(countries) {
    this.countries = countries;
  }

  getCountries() {
    return this.countries;
  }

  getCountriesByAmount(input, amount = 24) {
    const b = input * amount;
    const a = b - amount;
    const customArr = this.countries.slice(a, b);
    return customArr;
  }

  sortCountries() {
    this.countries.sort((a, b) => {
      return a.name.common.localeCompare(b.name.common);
    });
  }

  getCountry(countryName) {
    return this.countries.find(
      (country) => country.name.common === countryName
    );
  }
}
