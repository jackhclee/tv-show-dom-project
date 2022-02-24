//You can edit ALL of the code here

let matchedEpisodes = getAllGOTEpisodes();

function setup() {

  const rootElem = document.getElementById("root");

  rootElem.appendChild(makeSearchPanel());

  const searchResultPanelElm = document.createElement('div');
  searchResultPanelElm.setAttribute('id','searchPanel')

  rootElem.appendChild(searchResultPanelElm);
  makeSearchResultPanel(searchResultPanelElm, matchedEpisodes);
  
}

function makeSearchResultPanel(searchResultPanelElm, episodes) {
  for (let episode of episodes) {
    searchResultPanelElm.append(makeEpisodeParaElm(episode));
  }
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

  searchInputElm.addEventListener('change', (evt)=> {
    let searchWord = evt.target.value.toLocaleLowerCase.trim();
    let matchedEpisodes = getAllGOTEpisodes().filter(
      episode => 
      (episode.name.toLocaleLowerCase.indexOf(searchWord) >=0 ||
      episode.summary.toLocaleLowerCase.indexOf(searchWord) >=0)
      
      )
    
    evt.target.value = '';
  })

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
