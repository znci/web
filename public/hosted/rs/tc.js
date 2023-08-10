const API_ROOT = "http://127.0.0.1:3000/api/";

function sendAPIRequest(method, endpoint, data) {
  let url = API_ROOT + endpoint;
  let options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": document.getElementById("apikey_hidden").value,
      "x-user": document.getElementById("user_hidden").value
    }
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.error) {
        makeErrorBox("Error sending API request: " + res.error);
        throw res.error;
      }
      return res;
    });
}

function makeErrorBox(err) {
  let error_box = document.createElement("div");
  error_box.setAttribute("class", "error");
  error_box.innerHTML = "<strong>Error:</strong> " + err;
  document.getElementById("err_container").appendChild(error_box);
}
function makeWarningBox(warn) {
  let warning_box = document.createElement("div");
  warning_box.setAttribute("class", "warning");
  warning_box.innerHTML = "<strong>Warning:</strong> " + warn;
  document.getElementById("err_container").appendChild(warning_box);
}

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
