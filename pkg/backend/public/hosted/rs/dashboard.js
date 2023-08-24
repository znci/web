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

// on click of <a> newSite, send API request to create new site
document.getElementById("newSite").addEventListener("click", function () {
  sendAPIRequest("GET", "new").then((data) => {
    if (data.site) {
      window.location.href = "/sites/" + data.site;
    } else {
      makeErrorBox("Error creating new site: " + data.msg);
    }
  });
});

function test_err_box() {
  makeErrorBox("This is an error.");
}
