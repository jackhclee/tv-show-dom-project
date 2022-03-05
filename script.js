//You can edit ALL of the code here

function hideShowSelectionArea(hideShowSelection) {
  if (hideShowSelection) {
    document.getElementById(showProcessingAreaId).style.display = "none";
    document.getElementById(episodeProcessingAreaId).style.display = "block";
  } else {
    document.getElementById(showProcessingAreaId).style.display = "block";
    document.getElementById(episodeProcessingAreaId).style.display = "none";
  }
}

// We use Promise here to make sure async functions executes one by one 
const showSearchResultPanelHarbourId = "showSearchResultPanelHarbourId";

const showProcessingAreaId = "showProcessingAreaId";

const episodeProcessingAreaId = "episodeProcessingAreaId";

const matchedShowSpanElmId = "matchedShowSpanElmId";

function setup() {

  // initLocalEpisodesCache is async so
  //initLocalShowsCache();
  initLocalEpisodesCache(localShowsCache[0].id)
  .then((cache) => {

    matchedEpisodes = localEpisodesCache["S" + localShowsCache[0].id];
    console.log("lll");

    const rootElem = document.getElementById("root");
   
    let showProcessingBanner = document.createElement("div")
    showProcessingBanner.innerHTML = "SHOWS";
    showProcessingBanner.classList.add("shows-banner");

    rootElem.append(showProcessingBanner);

    let showProcessingArea = document.createElement("div");
    showProcessingArea.setAttribute("id", showProcessingAreaId);
    rootElem.appendChild(showProcessingArea);

    showProcessingArea.appendChild(makeShowSearchPanel());
    let showSearchResultPanelHarbour = document.createElement("div");
    showSearchResultPanelHarbour.setAttribute("id", showSearchResultPanelHarbourId);
    showProcessingArea.appendChild(showSearchResultPanelHarbour);
    showSearchResultPanelHarbour.appendChild(makeShowSearchResultPanel(localShowsCache));
    
    let episodeProcessingBanner = document.createElement("div")
    episodeProcessingBanner.innerHTML = "EPISODES";
    episodeProcessingBanner.classList.add("episodes-banner");

    rootElem.append(episodeProcessingBanner);

    let episodeProcessingArea = document.createElement("div");
    episodeProcessingArea.setAttribute("id", episodeProcessingAreaId);
    rootElem.appendChild(episodeProcessingArea);

    episodeProcessingArea.appendChild(makeSearchPanel());

    console.log("lll");

    episodeProcessingArea.appendChild(makeSearchResultPanel(matchedEpisodes));
  })
  .catch((error) => console.error(`Error within setup() ${error}`));
  
}

const showSelectElmId = "showSelectElmId";

const showSearchResultDivId = "showSearchResultDivId";

function makeShowSearchPanel() {
  let showSearchPanelElm = document.createElement("div");

  let showSearchInputElm = document.createElement("input");

  showSearchInputElm.addEventListener("change", (evt) => {

    let showSearchTerm = evt.target.value.toLowerCase();
    console.log(`showSearch input changed to ${evt.target.value}`);

    let matchedShows = localShowsCache.filter(
      (show) => {
        return (
          show.name.toLowerCase().indexOf(showSearchTerm) >= 0 
          || show.summary.toLowerCase().indexOf(showSearchTerm) >= 0 
          || show.genres.join(" ").toLowerCase().indexOf(showSearchTerm) >= 0 
        );
      }
    )

    updateShowSearchResultPanel(matchedShows);
    document.getElementById(matchedShowSpanElmId).innerHTML = `found ${matchedShows.length} shows`;
    document.getElementById(showSelectElmId).remove();
    showSearchPanelElm.append(makeShowSelectElm(matchedShows));
    evt.target = "";
  });

  let matchedShowSpanElm = document.createElement("span");
  matchedShowSpanElm.setAttribute("id","matchedShowSpanElmId");
  matchedShowSpanElm.innerHTML = `found ${localShowsCache.length} shows`;
  showSearchPanelElm.append(showSearchInputElm);
  showSearchPanelElm.append(matchedShowSpanElm);
  showSearchPanelElm.append(makeShowSelectElm(localShowsCache));

  return showSearchPanelElm;
}

function updateShowSelectControl(shows) {
  

}

function updateShowSearchResultPanel(shows) {
  console.log(`updateShowSearchResultPanel ${shows.length}`);

  document.getElementById(showSearchResultDivId).remove();


  document.getElementById(showSearchResultPanelHarbourId).append(makeShowSearchResultPanel(shows));
}

function makeShowSearchResultPanel(shows) {
  console.table(shows);
  let showSearchResultDiv = document.createElement("div");
  showSearchResultDiv.setAttribute("id", showSearchResultDivId);

  for (let show of shows) {
    let showDiv = document.createElement("div");

    let showNameSpan = document.createElement("span");
    showNameSpan.innerHTML = show.name;

    let showSummarySpan = document.createElement("span");
    showSummarySpan.innerHTML = show.summary;

    let showImage = document.createElement("img");
    show.image != null ? showImage.src = show.image.medium : showImage.src = "https://static.tvmaze.com/images/tvm-header-logo.png";

    let showMiscSpan = document.createElement("span");
    showMiscSpan.innerHTML
     = `${show.genres} / ${show.status} / ${show.rating.average} / ${show.runtime}`;

    showDiv.append(showImage);
    showDiv.append(showNameSpan);
  
    showDiv.append(showSummarySpan);
    showDiv.append(showMiscSpan);

    showDiv.addEventListener("click", (evt) => {
      console.log(`clicked show showId ${show.id}`);
      handleShowSelectionChange(show.id);
      hideShowSelectionArea(true);
    });

    showSearchResultDiv.append(showDiv);
  }

  return showSearchResultDiv;
}

function makeShowSelectElm(allShows) {
  let showSelectElm = document.createElement("select");
  showSelectElm.setAttribute("id", showSelectElmId);

  for (let show of allShows) {
    let option = document.createElement("option");
    option.setAttribute("value", show.id);
    option.innerText = show.name + ' - ' + show.id;
    showSelectElm.append(option);
  }

  // handle show selection change
  showSelectElm.addEventListener("change", (evt) => {
    console.log(`Show selection changed. Show ${evt.target.value} selected`);
    console.dir(evt);
    let showId = evt.target.value;
    handleShowSelectionChange(showId);
    hideShowSelectionArea(true);
  });
  return showSelectElm;
}

function handleShowSelectionChange(showId) {
  currentSelectedShowId = showId;
  fetchEpisodes(showId)
  .then((episodes) => {
    removeEpisodeSelectElm();
    document.getElementById(episodeSelectHarbourDivId).append(makeEpisodeSelectElm(episodes));
    updateSearchResultStat(episodes.length, episodes.length);
    updateSearchResult(episodes);
  });
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

  episodeSelectElm.addEventListener("change", () => {
    console.log(`episodeSelectElm changed to ${episodeSelectElm.value}`);
    console.log(`currentSelectedShowId ${currentSelectedShowId}`);

    matchedEpisodes = localEpisodesCache["S" + currentSelectedShowId].filter((episode) => episode.id == episodeSelectElm.value);
    updateSearchResultStat(matchedEpisodes.length, localEpisodesCache["S" + currentSelectedShowId].length);
    updateSearchResult(matchedEpisodes);
  });

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
  
  console.log("138");

  //searchPanelDivElm.append(makeShowSelectElm(localShowsCache));

  episodeSelectHarbourDiv.setAttribute("id", "episodeSelectHarbourDivId");
  searchPanelDivElm.appendChild(episodeSelectHarbourDiv);
  
  episodeSelectHarbourDiv.appendChild(makeEpisodeSelectElm(matchedEpisodes));

  searchPanelDivElm.appendChild(searchInputElm);
  searchPanelDivElm.appendChild(SearchResultSpan);

  searchPanelDivElm.appendChild(makeResetButton());

  return searchPanelDivElm;
}

function makeResetButton() {
  let resetBtn = document.createElement("button");
  resetBtn.innerText = "reset";
  resetBtn.addEventListener("click", () => {
    console.log("resetBtn clicked");
    hideShowSelectionArea(false);
  });
  return resetBtn;
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
