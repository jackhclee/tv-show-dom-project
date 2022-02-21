//You can edit ALL of the code here
function setup() {
  // const allEpisodes = getAllEpisodes();
  const allEpisodes = getAllGOTEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

function getEpisodeInfo(episodeNo) {
  const episodeInfoElem = document.getElementById("episodeInfo");
  return episodeInfoElem.textContent = getAllGOTEpisodes()[episodeNo]["name"];
}

window.onload = setup;
