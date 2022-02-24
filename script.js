//You can edit ALL of the code here
function setup() {
  // const allEpisodes = getAllEpisodes();
  const allEpisodes = getAllGOTEpisodes();
  makePageForEpisodes(allEpisodes);

  const rootElem = document.getElementById("root");

  rootElem.appendChild(makeSearchPanel());

  for (let episode of getAllEpisodes()) {
    rootElem.append(makeEpisodeParaElm(episode))
  }
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

function getEpisodeInfo(episodeNo) {
  const episodeInfoElem = document.getElementById("episodeInfo");
  return episodeInfoElem.textContent = getAllGOTEpisodes()[episodeNo]["name"];
}

function formatEpisodeCode(seasonNbr, episodeNbr) {
  return 'S' + (seasonNbr < 10 ? '0' : '') + seasonNbr + 'E' + (episodeNbr < 10 ? '0' : '') + episodeNbr ;
}

function makeSearchPanel() {
  let searchPanelDivElm = document.createElement('div');
  let searchInputElm = document.createElement('input');
  let allGOTEpisodes = getAllGOTEpisodes();
  let SearchResultSpan = makeSearchResultSpan(allGOTEpisodes.length, allGOTEpisodes.length);
  
  searchPanelDivElm.appendChild(searchInputElm);
  searchPanelDivElm.appendChild(SearchResultSpan);

  return searchPanelDivElm;
}

function makeSearchResultSpan(episodeFound, totalEpisode) {
  let searchResultSpanElm = document.createElement('span');
  searchResultSpanElm.innerHTML = `Displaying ${episodeFound}/${totalEpisode} episodes`;

  return searchResultSpanElm;
}

function makeEpisodeParaElm(episode) {
  let episodeParaElm = document.createElement('p');

  let episodeNumberSpanElm = document.createElement('span');
  episodeNumberSpanElm.innerHTML = formatEpisodeCode(episode.season, episode.number)

  let titleSpanElm = document.createElement('span');
  titleSpanElm.innerHTML = episode.name;

  let episodeImgElm = document.createElement('img');
  episodeImgElm.src = episode.image.medium;

  let synopsisElm = document.createElement('span');
  synopsisElm.innerHTML = episode.summary

  episodeParaElm.appendChild(episodeNumberSpanElm)
  episodeParaElm.appendChild(titleSpanElm)
  episodeParaElm.appendChild(episodeImgElm)
  episodeParaElm.appendChild(synopsisElm)

  return episodeParaElm;
}
window.onload = setup;
