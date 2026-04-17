/**
//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
*/

// You can edit ALL of the code here

/**
 * Formats season and episode numbers into an episode code.
 * @param {number} season - Season number
 * @param {number} episode - Episode number
 * @returns {string} Formatted code like "S02E07"
 */
function formatEpisodeCode(season, episode) {
  const paddedSeason = String(season).padStart(2, "0");
  const paddedEpisode = String(episode).padStart(2, "0");
  return `S${paddedSeason}E${paddedEpisode}`;
}

/**
 * Creates and returns a DOM element for a single episode.
 * @param {Object} episode - Episode object from TVMaze
 * @returns {HTMLElement} Article element representing the episode
 */
function createEpisodeCard(episode) {
  const article = document.createElement("article");
  article.className = "episode-card";

  // Episode name
  const title = document.createElement("h2");
  title.textContent = episode.name;
  article.appendChild(title);

  // Episode code (season + number)
  const code = document.createElement("p");
  code.className = "episode-code";
  code.textContent = formatEpisodeCode(episode.season, episode.number);
  article.appendChild(code);

  // Medium image (fallback if missing)
  const imageContainer = document.createElement("div");
  imageContainer.className = "episode-image";
  if (episode.image && episode.image.medium) {
    const img = document.createElement("img");
    img.src = episode.image.medium;
    img.alt = `${episode.name} promotional image`;
    imageContainer.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "no-image";
    placeholder.textContent = "No image available";
    imageContainer.appendChild(placeholder);
  }
  article.appendChild(imageContainer);

  // Summary (safe to use innerHTML because TVMaze provides sanitised HTML)
  const summary = document.createElement("div");
  summary.className = "episode-summary";
  summary.innerHTML = episode.summary || "<p>No summary available.</p>";
  article.appendChild(summary);

  // Link to the episode on TVMaze
  const episodeLink = document.createElement("a");
  episodeLink.href = episode.url;
  episodeLink.textContent = "View on TVMaze";
  episodeLink.target = "_blank";
  episodeLink.className = "episode-link";
  article.appendChild(episodeLink);

  return article;
}

/**
 * Renders all episodes into the #root container.
 * @param {Array} episodeList - Array of episode objects
 */
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous content

  // Create a container for the episode cards
  const episodesContainer = document.createElement("div");
  episodesContainer.className = "episodes-container";

  // Add each episode card
  for (const episode of episodeList) {
    const card = createEpisodeCard(episode);
    episodesContainer.appendChild(card);
  }

  // Add footer with credit to TVMaze
  const footer = document.createElement("footer");
  footer.className = "credit-footer";
  footer.innerHTML = `
    <p>
      Data originally from
      <a href="https://tvmaze.com/" target="_blank" rel="noopener noreferrer">TVMaze.com</a>
    </p>
  `;

  rootElem.appendChild(episodesContainer);
  rootElem.appendChild(footer);
}

/**
 * Initial setup – called when the page loads.
 */
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

window.onload = setup;
