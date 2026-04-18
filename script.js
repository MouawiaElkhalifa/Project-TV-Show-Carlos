let allEpisodes;

/**
 * Initial setup – called when the page loads.
 */
function setup() {

  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  populateSelect(allEpisodes);

  const searchInput = document.getElementById("search-input");
  const searchCount = document.getElementById("search-count");
  const episodeSelect = document.getElementById("episode-select");

  // 🔍 SEARCH
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
    searchCount.textContent = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;
  });

  // ⬇️ DROPDOWN
  episodeSelect.addEventListener("change", (event) => {
    const selectedId = event.target.value;

    if (selectedId === "") {
      makePageForEpisodes(allEpisodes);
      searchCount.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes`;
    } else {
      const selectedEpisode = allEpisodes.filter(
        (ep) => ep.id.toString() === selectedId
      );
      makePageForEpisodes(selectedEpisode);
      searchCount.textContent = `Displaying 1/${allEpisodes.length} episodes`;
    }
  });
}

/**
 * Populate dropdown
 */
function populateSelect(episodeList) {
  const select = document.getElementById("episode-select");

  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(
      episode.season,
      episode.number
    )} - ${episode.name}`;
    select.appendChild(option);
  });
}

/**
 * Format S01E01
 */
function formatEpisodeCode(season, episode) {
  const paddedSeason = String(season).padStart(2, "0");
  const paddedEpisode = String(episode).padStart(2, "0");
  return `S${paddedSeason}E${paddedEpisode}`;
}

/**
 * Create episode card
 */
function createEpisodeCard(episode) {
  const article = document.createElement("article");
  article.className = "episode-card";

  const title = document.createElement("h2");
  title.textContent = episode.name;
  article.appendChild(title);

  const code = document.createElement("p");
  code.className = "episode-code";
  code.textContent = formatEpisodeCode(
    episode.season,
    episode.number
  );
  article.appendChild(code);

  const imageContainer = document.createElement("div");
  imageContainer.className = "episode-image";

  // 🖼️ SAFE IMAGE HANDLING
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
 * Render episodes
 */
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  if (episodeList.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No episodes found.";
    rootElem.appendChild(message);
    return;
  }

  for (const episode of episodeList) {
    const card = createEpisodeCard(episode);
    episodesContainer.appendChild(card);
  }

  rootElem.appendChild(episodesContainer);
}

window.onload = setup;