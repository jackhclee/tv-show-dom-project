//You can edit ALL of the code here

let matchedEpisodes = getAllGOTEpisodes();

function setup() {

  const rootElem = document.getElementById("root");

  rootElem.appendChild(makeSearchPanel());

  rootElem.appendChild(makeSearchResultPanel(matchedEpisodes));
  
}

function makeSearchResultPanel(episodes) {
  const searchResultPanelElm = document.createElement("div");
  searchResultPanelElm.setAttribute("id","searchResultPanel");
  for (let episode of episodes) {
    searchResultPanelElm.append(makeEpisodeParaElm(episode));
  }
  return searchResultPanelElm;
}

function removeSearchResultPanel() {
  document.getElementById("searchResultPanel").remove();
}

function getEpisodeInfo(episodeNo) {
  const episodeInfoElem = document.getElementById("episodeInfo");
  return episodeInfoElem.textContent = getAllGOTEpisodes()[episodeNo]["name"];
}

function formatEpisodeCode(seasonNbr, episodeNbr) {
  return "S" + (seasonNbr < 10 ? "0" : "") + seasonNbr + "E" + (episodeNbr < 10 ? "0" : "") + episodeNbr ;
}

function updateSearchResult() {
  removeSearchResultPanel();
  document.getElementById('root').appendChild(makeSearchResultPanel(matchedEpisodes));
}

function makeSearchPanel() {
  let searchPanelDivElm = document.createElement("div");
  let searchInputElm = document.createElement("input");

  searchInputElm.addEventListener("change", (evt)=> {
    let searchWord = evt.target.value.toLowerCase().trim();
    console.log(searchWord)
   
    if (searchWord !== "") {
      matchedEpisodes = getAllGOTEpisodes().filter(
      episode => 
      (episode.name.toLowerCase().indexOf(searchWord) >=0 ||
      episode.summary.toLowerCase().indexOf(searchWord) >=0)
      
      );
    } else {
      matchedEpisodes = getAllGOTEpisodes();
    }
      console.table(matchedEpisodes);
      updateSearchResultStat(matchedEpisodes.length, getAllGOTEpisodes().length);
      updateSearchResult();
    evt.target.value = "";
  });

  let allGOTEpisodes = getAllGOTEpisodes();
  let SearchResultSpan = makeSearchResultStatSpan(allGOTEpisodes.length, allGOTEpisodes.length);
  
  searchPanelDivElm.appendChild(searchInputElm);
  searchPanelDivElm.appendChild(SearchResultSpan);

  return searchPanelDivElm;
}

function updateSearchResultStat(episodeFound, totalEpisode) {
  document.getElementById('searchResultStat').innerHTML
  = `Displaying ${episodeFound}/${totalEpisode} episodes`;
}

function makeSearchResultStatSpan(episodeFound, totalEpisode) {
  let searchResultStatSpanElm = document.createElement("span");
  searchResultStatSpanElm.setAttribute('id','searchResultStat')
  searchResultStatSpanElm.innerHTML = `Displaying ${episodeFound}/${totalEpisode} episodes`;

  return searchResultStatSpanElm;
}

function makeEpisodeParaElm(episode) {
  let episodeParaElm = document.createElement("p");

  let episodeNumberSpanElm = document.createElement("span");
  episodeNumberSpanElm.innerHTML = formatEpisodeCode(episode.season, episode.number);

  let titleSpanElm = document.createElement("span");
  titleSpanElm.innerHTML = episode.name;

  let episodeImgElm = document.createElement("img");
  episodeImgElm.src = episode.image.medium;

  let synopsisElm = document.createElement("span");
  synopsisElm.innerHTML = episode.summary;

  episodeParaElm.appendChild(episodeNumberSpanElm);
  episodeParaElm.appendChild(titleSpanElm);
  episodeParaElm.appendChild(episodeImgElm);
  episodeParaElm.appendChild(synopsisElm);

  return episodeParaElm;
}
window.onload = setup;
