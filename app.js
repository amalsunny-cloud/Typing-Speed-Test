"use strict";
const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing is a useful skill.",
    "Practice makes perfect."
];
const inputArea = document.getElementById("input");
const sentenceDiv = document.getElementById("sentence");
const resultDiv = document.getElementById("result");
const wordcountDiv = document.getElementById("wordcount");
const wpmDiv = document.getElementById("wpm");
const errorDiv = document.getElementById("error");
const restartBtn = document.getElementById("restart");
const parrot = document.querySelector(".parrot");
let startTime = 0;
let currentSentence;
let isTyping = false;
let typingTimeout;
function loadSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    console.log(randomIndex);
    currentSentence = sentences[randomIndex];
    sentenceDiv.textContent = currentSentence;
    inputArea.value = "";
    resultDiv.textContent = "";
    startTime = 0;
    isTyping = false;
    wordcountDiv.textContent = "0";
    wpmDiv.textContent = "0";
    errorDiv.textContent = "0";
    parrot.classList.remove("typing");
}
function countErrors(input, expected) {
    let errors = 0;
    const minLength = Math.min(input.length, expected.length);
    for (let i = 0; i < minLength; i++) {
        if (input[i] !== expected[i]) {
            errors++;
        }
    }
    errors += Math.abs(input.length - expected.length);
    return errors;
}
function updateHighlight(input, expected) {
    let highlighted = "";
    const minLength = Math.min(input.length, expected.length);
    for (let i = 0; i < minLength; i++) {
        const char = expected[i];
        const color = input[i] === char ? "#4dff4d" : "#ff4d4d";
        highlighted += `<span style="color:${color};">${char}</span>`;
    }
    if (input.length < expected.length) {
        highlighted += `<span style="background-color: #ffcc00; color: black; border-radius: 3px;">${expected[input.length]}</span>` + expected.substring(input.length + 1);
    }
    else if (input.length > expected.length) {
        highlighted += `<span style="color: #ff4d4d;">${input.substring(expected.length)}</span>`;
    }
    sentenceDiv.innerHTML = highlighted;
}
function calculateWPM(input, expected, timeTaken) {
    if (timeTaken === 0)
        return 0; // Prevent division by zero
    const inputWords = input.trim().split(/\s+/);
    const expectedWords = expected.trim().split(/\s+/);
    let correctWords = 0;
    for (let i = 0; i < Math.min(inputWords.length, expectedWords.length); i++) {
        if (inputWords[i] === expectedWords[i]) {
            correctWords++;
        }
    }
    return Math.round((correctWords / timeTaken) * 60);
}
inputArea.addEventListener("input", () => {
    if (!isTyping) {
        parrot.classList.add("typing");
        isTyping = true;
    }
    if (startTime === 0) {
        startTime = new Date().getTime();
    }
    const inputValue = inputArea.value;
    updateHighlight(inputValue, currentSentence);
    if (inputValue.length >= currentSentence.length) {
        const endTime = new Date().getTime();
        const timeTaken = (endTime - startTime) / 1000; // Time in seconds
        const expectedWords = currentSentence.trim().split(/\s+/);
        const expectedWordCount = expectedWords.length;
        const wpm = calculateWPM(inputValue, currentSentence, timeTaken);
        const errors = countErrors(inputValue, currentSentence);
        wordcountDiv.textContent = `${expectedWordCount}`;
        wpmDiv.textContent = `${wpm}`;
        errorDiv.textContent = `${errors}`;
        resultDiv.textContent = `Test completed in ${timeTaken.toFixed(1)} seconds`;
        parrot.classList.remove("typing");
        isTyping = false;
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        if (isTyping) {
            parrot.classList.remove("typing");
            isTyping = false;
        }
    }, 2000);
});
inputArea.addEventListener("blur", () => {
    if (isTyping) {
        parrot.classList.remove("typing");
        isTyping = false;
    }
});
inputArea.addEventListener("focus", () => {
    if (inputArea.value.length > 0 && !isTyping) {
        parrot.classList.add("typing");
        isTyping = true;
    }
});
restartBtn.addEventListener("click", loadSentence);
loadSentence();
