document.addEventListener("DOMContentLoaded", function () {
  // get value of hidden input 'site'
  let site = document.getElementById("site").value;
  site = JSON.parse(site);
  const b64 = site.b64_zwss;
  const decoded = atob(b64);
  const json = jsyaml.load(decoded);
  json.body.blocks.forEach((block) => {
    switch (block.type) {
      case "paragraph":
        const pb = document.createElement("div");
        pb.className = "block";
        const p = document.createElement("p");
        p.innerHTML = block.text;
        pb.appendChild(p);
        var blockindex = json.body.blocks.indexOf(block);
        var delete_button = document.createElement("button");
        delete_button.innerHTML = "Delete";
        delete_button.onclick = function () {
          sendAPIRequest(
            "PUT",
            `${site.id}?type=remove&index=` + blockindex,
            null,
            function () {
              location.reload();
            }
          );
        };
        pb.appendChild(delete_button);
        document.getElementById("content").appendChild(pb);
        break;
      case "heading":
        const hb = document.createElement("div");
        hb.className = "block";
        const h = document.createElement("h1");
        h.innerHTML = block.text;
        hb.appendChild(h);
        var blockindex = json.body.blocks.indexOf(block);
        var delete_button = document.createElement("button");
        delete_button.innerHTML = "Delete";
        delete_button.onclick = function () {
          sendAPIRequest(
            "PUT",
            `${site.id}?type=remove&index=` + blockindex,
            null,
            function () {
              location.reload();
            }
          );
        };
        hb.appendChild(delete_button);
        document.getElementById("content").appendChild(hb);

        break;
      case "image":
        const ib = document.createElement("div");
        ib.className = "block";
        const img = document.createElement("img");
        img.src = block.url;
        img.alt = block.alt;
        ib.appendChild(img);
        var blockindex = json.body.blocks.indexOf(block);
        var delete_button = document.createElement("button");
        delete_button.innerHTML = "Delete";
        delete_button.onclick = function () {
          sendAPIRequest(
            "PUT",
            `${site.id}?type=remove&index=` + blockindex,
            null,
            function () {
              location.reload();
            }
          );
        };
        ib.appendChild(delete_button);
        document.getElementById("content").appendChild(ib);

        break;
      case "link":
        const ab = document.createElement("div");
        ab.className = "block";
        const a = document.createElement("a");
        a.href = block.url;
        a.innerHTML = block.text;
        ab.appendChild(a);
        var blockindex = json.body.blocks.indexOf(block);
        var delete_button = document.createElement("button");
        delete_button.innerHTML = "Delete";
        delete_button.onclick = function () {
          sendAPIRequest(
            "PUT",
            `${site.id}?type=remove&index=` + blockindex,
            null,
            function () {
              location.reload();
            }
          );
        };
        ab.appendChild(delete_button);
        document.getElementById("content").appendChild(ab);
        break;
    }
  });
  // Add a new block
  var add = document.createElement("button");
  add.innerHTML = "Add";
  add.onclick = function () {
    document.getElementById("add_form").style.display = "block";
  };
  var add_a = document.getElementById("add_a");
  add_a.onclick = function () {
    var type = document.getElementById("type").value;
    var text = document.getElementById("text").value;
    var url = document.getElementById("url").value;
    var alt = document.getElementById("alt").value;
    var data = {
      type: type,
      text: text,
      url: url,
      alt: alt
    };
    console.log(data);
    var str = JSON.stringify(data);
    sendAPIRequest("PUT", `${site.id}?type=add`, data, function () {
      location.reload();
    });
  };

  document.getElementById("content").appendChild(add);
});

/* Block Editor */
