console.log("be.js loaded");

// get value of hidden input 'site'
let site = document.getElementById("site").value;
console.log(site);
let p = JSON.parse(site);

var BobTheBuilder = {};

BobTheBuilder.createParagraphBlock = function (block, index) {
  let content = document.getElementById("content");
  let box = document.createElement("div");
  box.className = "block";
  let paragraph = document.createElement("p");
  paragraph.innerHTML = block.text;
  box.appendChild(paragraph);
  // create a .blocklabel element
  let label = document.createElement("p");
  label.className = "blocklabel";
  label.innerHTML = block.type;
  box.appendChild(label);
  // create a .blockactionrow element
  let actionrow = document.createElement("div");
  actionrow.className = "blockactionrow";
  let edit = document.createElement("a");
  edit.href = "/dashboard/manage/" + p.id + "/edit/" + index;
  edit.innerHTML = "Edit";
  actionrow.appendChild(edit);
  let del = document.createElement("a");
  del.onclick = function () {
    console.log(p);
    sendAPIRequest("PUT", `${p.id}?type=remove&index=${index}`).then((data) => {
      console.log(data);
      location.reload();
    });
  };
  del.innerHTML = "Delete";
  actionrow.appendChild(del);
  box.appendChild(actionrow);
  content.appendChild(box);
};

BobTheBuilder.createHeaderBlock = function (block, index) {
  let content = document.getElementById("content");
  let box = document.createElement("div");
  box.className = "block";
  let h = document.createElement("hl");
  h.innerHTML = block.text;
  box.appendChild(h);

  // create a .blocklabel element
  let label = document.createElement("p");
  label.className = "blocklabel";
  label.innerHTML = block.type;
  box.appendChild(label);
  // create a .blockactionrow element
  let actionrow = document.createElement("div");
  actionrow.className = "blockactionrow";
  let edit = document.createElement("a");
  edit.href = "/dashboard/manage/" + p.id + "/edit/" + index;
  edit.innerHTML = "Edit";
  actionrow.appendChild(edit);
  let del = document.createElement("a");
  del.onclick = function () {
    sendAPIRequest("PUT", `${p.id}?type=remove&index=${index}`).then((data) => {
      console.log(data);
      location.reload();
    });
  };
  del.innerHTML = "Delete";
  actionrow.appendChild(del);
  box.appendChild(actionrow);

  content.appendChild(box);
};

BobTheBuilder.createImageBlock = function (block, index) {
  let content = document.getElementById("content");
  let box = document.createElement("div");
  box.className = "block";
  let img = document.createElement("img");
  img.src = block.url;
  img.alt = block.alt;
  box.appendChild(img);
  // create a .blocklabel element
  let label = document.createElement("p");
  label.className = "blocklabel";
  label.innerHTML = block.type;
  box.appendChild(label);
  // create a .blockactionrow element
  let actionrow = document.createElement("div");
  actionrow.className = "blockactionrow";
  let edit = document.createElement("a");
  edit.href = "/dashboard/manage/" + p.id + "/edit/" + index;
  edit.innerHTML = "Edit";
  actionrow.appendChild(edit);
  let del = document.createElement("a");
  del.onclick = function () {
    sendAPIRequest("PUT", `${p.id}?type=remove&index=${index}`).then((data) => {
      console.log(data);
      location.reload();
    });
  };
  del.innerHTML = "Delete";
  actionrow.appendChild(del);
  box.appendChild(actionrow);
  content.appendChild(box);
};

BobTheBuilder.createLinkBlock = function (block, index) {
  let content = document.getElementById("content");
  let box = document.createElement("div");
  box.className = "block";
  let a = document.createElement("a");
  a.href = block.url;
  a.innerHTML = block.text;
  box.appendChild(a);
  // create a .blocklabel element
  let label = document.createElement("p");
  label.className = "blocklabel";
  label.innerHTML = block.type;
  box.appendChild(label);

  // create a .blockactionrow element
  let actionrow = document.createElement("div");
  actionrow.className = "blockactionrow";
  let edit = document.createElement("a");
  edit.href = "/dashboard/manage/" + p.id + "/edit/" + index;
  edit.innerHTML = "Edit";
  actionrow.appendChild(edit);
  let del = document.createElement("a");
  del.onclick = function () {
    sendAPIRequest("PUT", `${p.id}?type=remove&index=${index}`).then((data) => {
      console.log(data);
      location.reload();
    });
  };
  del.innerHTML = "Delete";
  actionrow.appendChild(del);
  box.appendChild(actionrow);
  content.appendChild(box);
};

var start = async function () {
  let json = await sendAPIRequest("GET", p.id);
  console.log(json);

  // Loop through the blocks and create the appropriate HTML element
  for (let i = 0; i < json.body.blocks.length; i++) {
    let block = json.body.blocks[i];
    switch (block.type) {
      case "paragraph":
        BobTheBuilder.createParagraphBlock(block, i);
        break;
      case "heading":
        BobTheBuilder.createHeaderBlock(block, i);
        break;
      case "image":
        BobTheBuilder.createImageBlock(block, i);
        break;
      case "link":
        BobTheBuilder.createLinkBlock(block, i);
        break;
    }
  }
};

start();

// Create an "Add Block" button
let addBlock = document.createElement("a");
addBlock.href = "/dashboard/manage/" + p.id + "/add";
addBlock.innerHTML = "Add Block";
document.getElementById("content").appendChild(addBlock);

// Path: public\hosted\rs\be.js
