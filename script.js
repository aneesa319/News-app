const apiKey = 'f99b64322d4d4a3089dc737cc6ea44f4';
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

async function fetchRandomNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=50&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error("Error fetching news by query", error);
        return [];
    }
}

function displayBlogs(articles) {
    blogContainer.innerHTML = "";

    if (articles.length === 0) {
        blogContainer.innerHTML = "<p>No news articles found. Try another search.</p>";
        return;
    }

    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        // Image
        const img = document.createElement("img");
        img.src = article.urlToImage || "./images/no-image.png";
        img.alt = article.title || "News image";
        img.onerror = () => {
            img.src = "./images/no-image.png";
        };

        // Title
        const title = document.createElement("h2");
        title.textContent = article.title
            ? (article.title.length > 40 ? article.title.slice(0, 40) + "..." : article.title)
            : "No title";

        // Description
        const description = document.createElement("p");
        description.textContent = article.description
            ? (article.description.length > 120 ? article.description.slice(0, 120) + "..." : article.description)
            : "No description available.";

        // Append
        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);

        // Click → open article
        if (article.url) {
            blogCard.addEventListener("click", () => {
                window.open(article.url, "_blank");
            });
        }

        blogContainer.appendChild(blogCard);
    });
}

// Run after DOM is ready
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error initializing app:", error);
    }

    searchButton.addEventListener("click", async () => {
        const query = searchField.value.trim();
        if (query !== "") {
            try {
                const articles = await fetchNewsQuery(query);
                displayBlogs(articles);
            } catch (error) {
                console.log("Error fetching News by Query", error);
            }
        }
    });
});
