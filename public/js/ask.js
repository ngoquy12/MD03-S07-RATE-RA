const textarea = document.getElementById("ask-question");

textarea.addEventListener("input", function (event) {
  const inputText = event.target.value;

  // Do something with the input text
  console.log(inputText);
});

const form = document.querySelector(".main-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("form");
});
