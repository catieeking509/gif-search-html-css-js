
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

function getFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    if (favorites === null) {
        favorites = [];
    }   
    return favorites; 
}

function updateLocalStorage(topic, num) {
    let favorites = getFavorites();
    favorites = [{ topic, num }, ...favorites.slice(0, 9)];
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function renderFavorites() {
    let favorites = getFavorites();
    document.querySelector('.js-favorites-section').innerHTML = favorites.map(item => `
        <button data-topic=${item.topic} data-num=${item.num} class="btn btn-success">
            ${decodeURIComponent(item.topic)} (${item.num})
        </button>`).join('');
}

function queryResults(topic, num, skipSave = false) {
    fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${topic}&limit=${num}&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
    ).then ((x) => x.json())
    .then(response => {
        if (!skipSave) {
            updateLocalStorage(topic, num);
            renderFavorites();
        }
        renderGif(response);
    });
}

function formSubmitted(event) {
    event.preventDefault();
    let queriedTopic = document.querySelector("[name=search-input]").value;
    queriedTopic = queriedTopic.trim();
    queriedTopic = encodeURIComponent(queriedTopic);
    let numOfGif = document.querySelector("[name=number-of-gif]").value;
    queryResults(queriedTopic, numOfGif);
}

function favoriteClicked(event) {
    let {topic, num} = event.target.dataset;
    if (typeof topic === 'string' && typeof num === 'string') {
        queryResults(topic, num, true);
    }

}

document.querySelector(".js-gif-search").addEventListener("submit", formSubmitted);
document.querySelector('.js-favorites-section').addEventListener('click', favoriteClicked);


renderFavorites();

