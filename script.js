let allEpisodes = [];

/**
 * Format episode code (e.g., S01E01)
 */
function formatEpisodeCode(season, episode) {
  const paddedSeason = String(season).padStart(2, "0");
  const paddedEpisode = String(episode).padStart(2, "0");
  return `S${paddedSeason}E${paddedEpisode}`;
}

/**
 * Create a single episode card
 */
function createEpisodeCard(episode) {
  const article = document.createElement("article");
  article.className = "episode-card";

  const title = document.createElement("h2");
  title.textContent = episode.name;
  article.appendChild(title);

  const code = document.createElement("p");
  code.className = "episode-code";
  code.textContent = formatEpisodeCode(episode.season, episode.number);
  article.appendChild(code);

  const imageContainer = document.createElement("div");
  imageContainer.className = "episode-image";

  if (episode.image && (episode.image.medium || episode.image.original)) {
    const img = document.createElement("img");
    img.src = episode.image.medium || episode.image.original;
    img.alt = episode.name;
    imageContainer.appendChild(img);
  } else {
    const noImg = document.createElement("div");
    noImg.className = "no-image";
    noImg.textContent = "No image available";
    imageContainer.appendChild(noImg);
  }

  article.appendChild(imageContainer);

  const summary = document.createElement("div");
  summary.className = "episode-summary";
  summary.innerHTML = episode.summary || "<p>No summary available.</p>";
  article.appendChild(summary);

  return article;
}

/**
 * Render episodes into the DOM
 */
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  if (episodeList.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No episodes found.";
    rootElem.appendChild(message);
    return;
  }

  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  for (const episode of episodeList) {
    const card = createEpisodeCard(episode);
    episodesContainer.appendChild(card);
  }

  rootElem.appendChild(episodesContainer);
}

/**
 * Populate the dropdown selector
 */
function populateSelect(episodeList) {
  const select = document.getElementById("episode-select");
  // Clear existing options (except the first "All episodes" one)
  while (select.options.length > 1) {
    select.remove(1);
  }

  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    select.appendChild(option);
  });
}

/**
 * Update the search count display
 */
function updateSearchCount(filteredCount, totalCount) {
  const searchCountSpan = document.getElementById("search-count");
  searchCountSpan.textContent = `Displaying ${filteredCount}/${totalCount} episodes`;
}

/**
 * Show an error message to the user
 */
function showError(message) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `
    <div class="error-message">
      ⚠️ ${message}<br>
      Please try refreshing the page.
    </div>
  `;
  // Also update the count display to indicate error
  const searchCountSpan = document.getElementById("search-count");
  searchCountSpan.textContent = `Error loading episodes`;
}

/**
 * Main setup function – fetches data and initializes UI
 */
async function setup() {
  // Show loading indicator (already in HTML, but ensure it's visible)
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = '<div class="loading-message">Loading episodes...</div>';

  try {
    // Fetch data from TVMaze API
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    allEpisodes = data;

    // Clear loading message and render episodes
    makePageForEpisodes(allEpisodes);
    populateSelect(allEpisodes);
    updateSearchCount(allEpisodes.length, allEpisodes.length);

    // Set up search input listener
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.toLowerCase();

      const filteredEpisodes = allEpisodes.filter((episode) => {
        const name = episode.name || "";
        const summary = episode.summary || "";
        return (
          name.toLowerCase().includes(searchTerm) ||
          summary.toLowerCase().includes(searchTerm)
        );
      });

      makePageForEpisodes(filteredEpisodes);
      updateSearchCount(filteredEpisodes.length, allEpisodes.length);
    });

    // Set up dropdown selector listener
    const episodeSelect = document.getElementById("episode-select");
    episodeSelect.addEventListener("change", (event) => {
      const selectedId = event.target.value;

      if (selectedId === "") {
        makePageForEpisodes(allEpisodes);
        updateSearchCount(allEpisodes.length, allEpisodes.length);
        // Also clear the search input
        searchInput.value = "";
      } else {
        const selectedEpisode = allEpisodes.filter(
          (ep) => ep.id.toString() === selectedId
        );
        makePageForEpisodes(selectedEpisode);
        updateSearchCount(selectedEpisode.length, allEpisodes.length);
        // Optionally clear search input when using dropdown
        searchInput.value = "";
      }
    });
  } catch (error) {
    console.error("Failed to fetch episodes:", error);
    showError("Failed to load episodes. Please check your internet connection and try again.");
  }
}

// Start the app when the page loads
window.onload = setup;
