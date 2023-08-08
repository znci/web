document.addEventListener("DOMContentLoaded", function () {
  console.log(
    "%cznci/web",
    "background: #222; color: #bada55; font-size: 24px; padding: 10px;"
  );
});

// get hidden input value
var hidden_input = document.getElementById("apikey_hidden");
document.getElementById("api_key").addEventListener("mouseover", function () {
  let api_key = document.getElementById("api_key");
  api_key.innerHTML = hidden_input.value;
});

document.getElementById("api_key").addEventListener("mouseout", function () {
  document.getElementById("api_key").innerHTML =
    "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
});
