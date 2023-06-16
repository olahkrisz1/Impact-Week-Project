//Get reference to our submit button and chatbot field
const submit = document.getElementById("submit");
const responseField = document.getElementById("response");
const userInput = document.getElementById("user-input");
const chatHistory = document.getElementById("chat-history");
const loading = document.getElementById("spinner");

let promptResponses = [];

//Our call to the API
const generateResponse = async () => {
  //Get the user input field value
  //Set loading spinner
  loading.classList.remove("visually-hidden");
  submit.classList.add("visually-hidden");
  const input = userInput.value;
  const response = await fetch("/chat", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }],
      temp: 0.6,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  const message = responseData.result[0].message.content;
  console.log(message);

  //Store our previous messages
  promptResponses.push({ question: input, response: message });
  //Clear both fields
  userInput.value = "";

  const responseElement = document.createElement("div");
  responseElement.innerHTML = `<li class="list-group-item">Prompt: ${input}</li>
    <li class="list-group-item"> Response: ${message}</li>`;
  chatHistory.appendChild(responseElement);

  //Stop loading spinner
  loading.classList.add("visually-hidden");
  submit.classList.remove("visually-hidden");
};

//Assign onclick method
submit.onclick = generateResponse;

let recognition = new webkitSpeechRecognition();
let textbox = $("#title");
let instructions = $("#instructions");
let content = "";

recognition.continuous = true;

recognition.onstart = function () {
  instructions.text("Voice recognition is on");
};

recognition.onspeechend = function () {
  instructions.text("No activity");
};

recognition.onerror = function () {
  instructions.text("Try again");
};

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  content += transcript;
  textbox.val(content);
};

$("#start-btn").click(function (event) {
  if (content.length) {
    content += " ";
  }
  recognition.start();
});

textbox.on("input", function () {
  content = $(this).val();
});
