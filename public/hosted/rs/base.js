const API_ROOT = "http://127.0.0.1:3000/api/";

function sendAPIRequest(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    let url = API_ROOT + endpoint;
    let options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": document.getElementById("apikey_hidden").value,
        "x-user": document.getElementById("user_hidden").value,
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    fetch(url, options)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((err) => {
            throw err;
          });
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
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
    "background: #222; color: #bada55; font-size: 24px; padding: 10px;",
  );
});
