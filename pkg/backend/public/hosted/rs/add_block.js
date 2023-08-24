// Block add form
let site = document.getElementById("site").value;
let p = JSON.parse(site);

let block_options = {
  paragraph: {
    type: "paragraph",
    fields: [
      {
        type: "textarea",
        name: "text",
        label: "Text",
      },
    ],
  },
  heading: {
    type: "heading",
    fields: [
      {
        type: "text",
        name: "text",
        label: "Text",
      },
    ],
  },
  image: {
    type: "image",
    fields: [
      {
        type: "text",
        name: "url",
        label: "URL",
      },
      {
        type: "text",
        name: "alt",
        label: "Alt Text",
      },
    ],
  },
  link: {
    type: "link",
    fields: [
      {
        type: "text",
        name: "url",
        label: "URL",
      },
      {
        type: "text",
        name: "text",
        label: "Text",
      },
    ],
  },
};

// Create a form for adding a block (not actually a form, we call sendApiRequest() directly)
let content = document.getElementById("add_block");
let form = document.createElement("form");
form.id = "add_block_form";
// Don't let the form submit
form.onsubmit = function () {
  return false;
};
// Create a select element
let select = document.createElement("select");
select.id = "block_type";
select.name = "block_type";
// Create an option for each block type
for (let i = 1; i <= Object.keys(block_options).length; i++) {
  let option = document.createElement("option");
  option.value = i;
  option.innerHTML = Object.keys(block_options)[i - 1];
  select.appendChild(option);
}

// Create a div for each field
let fields = document.createElement("div");
fields.id = "fields";
// Create a submit button
let submit = document.createElement("input");
submit.type = "submit";
submit.value = "Add Block";
// Append everything to the form
form.appendChild(select);
form.appendChild(fields);
form.appendChild(submit);
// Append the form to the content div
content.appendChild(form);

// When the select element changes, update the fields
select.onchange = function () {
  // Clear the fields div
  fields.innerHTML = "";
  // Get the block type
  let type = block_options[Object.keys(block_options)[select.value - 1]];
  // Loop through the fields and create the appropriate HTML element
  for (let i = 0; i < type.fields.length; i++) {
    let field = type.fields[i];
    let element = document.createElement("input");
    element.type = field.type;
    element.name = field.name;
    element.placeholder = field.label;
    fields.appendChild(element);
  }
};

// When the form is submitted, send the API request
form.onsubmit = function () {
  let data = {};
  // we must send the data like with URL params being ?type=add and the body being the block
  data.type = "add";
  data.block = {};
  // Get the block type
  let type = block_options[Object.keys(block_options)[select.value - 1]];
  // Loop through the fields and add them to the data
  for (let i = 0; i < type.fields.length; i++) {
    let field = type.fields[i];
    data.block[field.name] = form[field.name].value;
  }

  // Add the type to the data
  data.block.type = type.type;

  // Send the API request
  sendAPIRequest("PUT", `${p.id}?type=${data.type}`, data.block).then(
    (data) => {
      // if 200, reload the page
      if (data.status == 200) {
        location.reload();
      }
    },
  );
};

// Create a "Back" button
let back = document.createElement("a");
back.href = "/dashboard/manage/" + p.id;
back.innerHTML = "Back";
content.appendChild(back);

// Path: public\hosted\rs\add_block.js
