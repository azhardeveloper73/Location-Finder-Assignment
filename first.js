let showUSer = document.querySelector("#showUSer");
let result = document.querySelector("#result");

showUSer.addEventListener("click", showLocation);

function showLocation() {
  if (!navigator.geolocation) {
    result.innerHTML = "Geolocation not supported.";
    return;
  }
  result.innerHTML = "Getting location...";

  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Reverse Geocoding
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const { address } = data;
        const countryCode = address.country_code;

        // Get country info
        return fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
          .then((res) => res.json())
          .then((countryData) => {
            const [country] = countryData;
            console.log(country);

            const nameOffic = country.name.official;

            result.innerHTML = `
              <b>City:</b> ${
                address.city || address.town || address.village ||  "N/A"
              }<br>
              <b>State / Region:</b> ${address.state || "N/A"}<br>
              <b>Country:</b> ${address.country}<br>
              <b>Republic:</b> ${nameOffic}<br>
              <b>Capital:</b> ${
                country.capital ? country.capital[0] : "N/A"
              }<br>
              <img class="flag" src="${country.flags.png}" alt="Flag">
            `;
          });
      })
      .catch((err) => {
        console.log(err);
        result.innerHTML = "Unable to fetch location info.";
      });
  });
}