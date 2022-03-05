//You can edit ALL of the code here

// We use Promise here to make sure async functions executes one by one 

function setup() {

  // initLocalEpisodesCache is async so
  //initLocalShowsCache();
  initLocalEpisodesCache(localShowsCache[0].id)
  .then((cache) => {

    matchedEpisodes = localEpisodesCache["S" + localShowsCache[0].id];
    console.log("lll");

    const rootElem = document.getElementById("root");
    console.log("lll");
    rootElem.appendChild(makeSearchPanel());

    console.log("lll");

    rootElem.appendChild(makeSearchResultPanel(matchedEpisodes));
  })
  .catch((error) => console.error(`Error within setup() ${error}`));
  
}

const showSelectElmId = "showSelectElmId";

function makeShowSelectElm(allShows) {
  let episodeSelectElm = document.createElement("select");
  episodeSelectElm.setAttribute("id", showSelectElmId);

  for (let show of allShows) {
    let option = document.createElement("option");
    option.setAttribute("value", show.id);
    option.innerText = show.name + ' - ' + show.id;
    episodeSelectElm.append(option);
  }

  // handle show selection change
  episodeSelectElm.addEventListener("change", (evt) => {
    console.log(`Show selection changed. Show ${evt.target.value} selected`);
    console.dir(evt);
    let showId = evt.target.value;
    currentSelectedShowId = showId;
    fetchEpisodes(showId)
    .then((episodes) => {
      removeEpisodeSelectElm();
      document.getElementById(episodeSelectHarbourDivId).append(makeEpisodeSelectElm(episodes));
      updateSearchResultStat(episodes.length, episodes.length);
      updateSearchResult(episodes);
    });
  });
  return episodeSelectElm;
}

const episodeSelectElmId = "episodeSelectElm";
const episodeSelectHarbourDivId = "episodeSelectHarbourDivId";

function makeEpisodeSelectElm(allEpisodes) {
  let episodeSelectElm = document.createElement("select");
  episodeSelectElm.setAttribute("id", episodeSelectElmId);

  for (let episode of allEpisodes) {
    let option = document.createElement("option");
    option.setAttribute("value", episode.id);
    option.innerText = formatEpisodeCode(episode.season, episode.number) + " - " + episode.name;
    episodeSelectElm.append(option);
  }
  return episodeSelectElm;
}

function removeEpisodeSelectElm() {
  document.getElementById(episodeSelectElmId).remove();
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

function updateSearchResult(matchedEpisodes) {
  removeSearchResultPanel();
  document.getElementById("root").appendChild(makeSearchResultPanel(matchedEpisodes));
}

const searchPanel = "searchPanel";

let currentSelectedShowId;

function makeSearchPanel() {
  let searchPanelDivElm = document.createElement("div");
  searchPanelDivElm.setAttribute("id", "searchPanel");

  let searchInputElm = document.createElement("input");

  console.log("ABN");

  currentSelectedShowId = localShowsCache[0].id;
     
  matchedEpisodes = localEpisodesCache["S" + currentSelectedShowId];

  searchInputElm.addEventListener("change", (evt)=> {
    let searchWord = evt.target.value.toLowerCase().trim();
    console.log(`searchWord is ${searchWord} for ${currentSelectedShowId}`);
    if (searchWord !== "") {
      matchedEpisodes = localEpisodesCache["S" + currentSelectedShowId].filter(
      episode => 
      (episode.name.toLowerCase().indexOf(searchWord) >=0 ||
      episode.summary.toLowerCase().indexOf(searchWord) >=0)
      
      );
    } else {
      matchedEpisodes = localEpisodesCache["S" + currentSelectedShowId];
    }
    console.table(matchedEpisodes);
    updateSearchResultStat(matchedEpisodes.length, localEpisodesCache["S" + currentSelectedShowId].length);
    updateSearchResult(matchedEpisodes);
    evt.target.value = "";
  });

  console.log("ABN");

  let SearchResultSpan = makeSearchResultStatSpan(matchedEpisodes.length, matchedEpisodes.length);
  
  let episodeSelectHarbourDiv = document.createElement("div");
  
  console.log("138")

  searchPanelDivElm.append(makeShowSelectElm(localShowsCache));

  episodeSelectHarbourDiv.setAttribute("id", "episodeSelectHarbourDivId");
  searchPanelDivElm.appendChild(episodeSelectHarbourDiv);
  
  episodeSelectHarbourDiv.appendChild(makeEpisodeSelectElm(matchedEpisodes));

  searchPanelDivElm.appendChild(searchInputElm);
  searchPanelDivElm.appendChild(SearchResultSpan);

  return searchPanelDivElm;
}

function updateSearchResultStat(episodeFound, totalEpisode) {
  document.getElementById("searchResultStat").innerHTML
  = `Displaying ${episodeFound}/${totalEpisode} episodes`;
}

function makeSearchResultStatSpan(episodeFound, totalEpisode) {
  let searchResultStatSpanElm = document.createElement("span");
  searchResultStatSpanElm.setAttribute("id","searchResultStat");
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
  episode.image != null ? episodeImgElm.src = episode.image.medium : episodeImgElm.src = "https://static.tvmaze.com/images/tvm-header-logo.png";

  let synopsisElm = document.createElement("span");
  synopsisElm.innerHTML = episode.summary;

  episodeParaElm.appendChild(episodeNumberSpanElm);
  episodeParaElm.appendChild(titleSpanElm);
  episodeParaElm.appendChild(episodeImgElm);
  episodeParaElm.appendChild(synopsisElm);

  return episodeParaElm;
}
window.onload = setup;
