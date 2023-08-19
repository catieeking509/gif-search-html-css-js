
const API_KEY = "xlQQPc8AJCtUQHulC1HTWSWe4lZr6Myy";

function renderGif(response) {
    const gifData = response.data;
    let html = "";
    if (gifData.length === 0) {
        html = '<div class="error">No GIF found. Try again.</div>';
    } else {
        for (let gif of gifData) {
            let url = gif.images.fixed_height.url;
            let alt = gif.title;
            html += `<img src="${url}" alt="${alt}" class="giphy-img" />`;
        } 
    }
    document.querySelector(".js-results-section").innerHTML = html;
}

function queryResults(topic, num) {
    fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${topic}&limit=${num}&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
    ).then ((x) => x.json())
    .then(renderGif);
}

function formSubmitted(event) {
    event.preventDefault();
    let queriedTopic = document.querySelector("[name=search-input]").value;
    queriedTopic = queriedTopic.trim();
    queriedTopic = encodeURIComponent(queriedTopic);
    let numOfGif = document.querySelector("[name=number-of-gif]").value;
    queryResults(queriedTopic, numOfGif);
}

document.querySelector(".js-gif-search").addEventListener("submit", formSubmitted);