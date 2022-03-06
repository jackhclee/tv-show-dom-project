//You can edit ALL of the code here
/* global localShowsCache, localEpisodesCache */
// We use Promise here to make sure async functions executes one by one 

const showProcessingAreaId = "showProcessingAreaId";

const showSearchPanelId = "showSearchPanelId";

const showSelectControlId = "showSelectControlId";

const showSearchResultPanelHarbourId = "showSearchResultPanelHarbourId";

const showSearchResultDivId = "showSearchResultDivId";

const matchedShowSpanElmId = "matchedShowSpanElmId";

const episodeProcessingAreaId = "episodeProcessingAreaId";

const episodeSearchPanelId = "episodeSearchPanelId";

const episodeSelectHarbourDivId = "episodeSelectHarbourDivId";

const episodeSelectControlId = "episodeSelectControl";

const episodeSearchResultPanelId = "episodeSearchResultPanelId";

const episodeSearchResultStat = "episodeSearchResultStat";

let currentSelectedShowId = 0;

function hideShowSelectionArea(hideShowSelection) {
  if (hideShowSelection) {
    document.getElementById(showProcessingAreaId).style.display = "none";
    document.getElementById(episodeProcessingAreaId).style.display = "block";
  } else {
    document.getElementById(showProcessingAreaId).style.display = "block";
    document.getElementById(episodeProcessingAreaId).style.display = "none";
  }
}

function setup() {

  // initLocalEpisodesCache is async
  initLocalEpisodesCache(localShowsCache[0].id)
  .then(() => {

    matchedEpisodes = localEpisodesCache["S" + localShowsCache[0].id];

    const rootElem = document.getElementById("root");
   
    let showProcessingBanner = document.createElement("div");
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
    
    let episodeProcessingBanner = document.createElement("div");
    episodeProcessingBanner.innerHTML = "EPISODES";
    episodeProcessingBanner.classList.add("episodes-banner");

    rootElem.append(episodeProcessingBanner);

    let episodeProcessingArea = document.createElement("div");
    episodeProcessingArea.setAttribute("id", episodeProcessingAreaId);
    rootElem.appendChild(episodeProcessingArea);

    episodeProcessingArea.appendChild(makeEpisodeSearchPanel());

    episodeProcessingArea.appendChild(makeEpisodeSearchResultPanel(matchedEpisodes));

    hideShowSelectionArea(false);

  })
  .catch((error) => console.error(`Error within setup() ${error}`));
  
}

function makeShowSearchPanel() {
  let showSearchPanelElm = document.createElement("div");
  showSearchPanelElm.setAttribute("id", showSearchPanelId);

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
    );

    updateShowSearchResultPanel(matchedShows);
    document.getElementById(matchedShowSpanElmId).innerHTML = `found ${matchedShows.length} shows`;
    document.getElementById(showSelectControlId).remove();
    showSearchPanelElm.append(makeShowSelectControl(matchedShows));
    evt.target = "";
  });

  let matchedShowSpanElm = document.createElement("span");
  matchedShowSpanElm.setAttribute("id","matchedShowSpanElmId");
  matchedShowSpanElm.innerHTML = `found ${localShowsCache.length} shows`;

  let inputHint = document.createElement("span");
  inputHint = "Enter search term to search ";
  showSearchPanelElm.append(inputHint);
  showSearchPanelElm.append(showSearchInputElm);
  showSearchPanelElm.append(matchedShowSpanElm);
  showSearchPanelElm.append(makeShowSelectControl(localShowsCache));

  return showSearchPanelElm;
}

function updateShowSelectControl(shows) {
  

}

function makeShowSearchResultPanel(shows) {
  console.table(shows);
  let showSearchResultDiv = document.createElement("div");
  showSearchResultDiv.setAttribute("id", showSearchResultDivId);

  for (let show of shows) {
    let showDiv = document.createElement("div");
    showDiv.classList.add("show-entry");

    let showNameSpan = document.createElement("span");
    showNameSpan.classList.add("show-name");
    showNameSpan.innerHTML = show.name;

    let showSummarySpan = document.createElement("span");
    showSummarySpan.innerHTML = show.summary;

    let showImage = document.createElement("img");
    show.image != null ? showImage.src = show.image.medium : showImage.src = "https://static.tvmaze.com/images/tvm-header-logo.png";

    let showMiscSpan = document.createElement("span");
    showMiscSpan.innerHTML
     = `${show.genres} / ${show.status} / ${show.rating.average} / ${show.runtime}`;

    showDiv.append(showImage);

    let showDetailDiv = document.createElement("div");

    showDetailDiv.append(showNameSpan);
  
    showDetailDiv.append(showSummarySpan);
    showDetailDiv.append(showMiscSpan);

    showDiv.append(showDetailDiv);

    showDiv.addEventListener("click", (evt) => {
      console.log(`clicked show showId ${show.id}`);
      handleShowSelectionChange(show.id);
      hideShowSelectionArea(true);
    });

    showSearchResultDiv.append(showDiv);
  }

  return showSearchResultDiv;
}

function updateShowSearchResultPanel(shows) {
  console.log(`updateShowSearchResultPanel ${shows.length}`);

  document.getElementById(showSearchResultDivId).remove();


  document.getElementById(showSearchResultPanelHarbourId).append(makeShowSearchResultPanel(shows));
}


function makeShowSelectControl(allShows) {
  let showSelectElm = document.createElement("select");
  showSelectElm.setAttribute("id", showSelectControlId);

  for (let show of allShows) {
    let option = document.createElement("option");
    option.setAttribute("value", show.id);
    option.innerText = show.name + " - " + show.id;
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
    removeEpisodeSelectControl();
    document.getElementById(episodeSelectHarbourDivId).append(makeEpisodeSelectControl(episodes));
    updateEpisodeSearchResultStat(episodes.length, episodes.length);
    updateEpisodeSearchResultPanel(episodes);
  });
}

function makeEpisodeSelectControl(allEpisodes) {
  let episodeSelectElm = document.createElement("select");
  episodeSelectElm.setAttribute("id", episodeSelectControlId);

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
    updateEpisodeSearchResultStat(matchedEpisodes.length, localEpisodesCache["S" + currentSelectedShowId].length);
    updateEpisodeSearchResultPanel(matchedEpisodes);
  });

  return episodeSelectElm;
}

function removeEpisodeSelectControl() {
  document.getElementById(episodeSelectControlId).remove();
}

function makeEpisodeSearchResultPanel(episodes) {
  const searchResultPanelElm = document.createElement("div");
  searchResultPanelElm.setAttribute("id",episodeSearchResultPanelId);
  for (let episode of episodes) {
    searchResultPanelElm.append(makeEpisodeParaElm(episode));
  }
  return searchResultPanelElm;
}

function removeEpisodeSearchResultPanel() {
  document.getElementById(episodeSearchResultPanelId).remove();
}

function getEpisodeInfo(episodeNo) {
  const episodeInfoElem = document.getElementById("episodeInfo");
  return episodeInfoElem.textContent = getAllGOTEpisodes()[episodeNo]["name"];
}

function formatEpisodeCode(seasonNbr, episodeNbr) {
  return "S" + (seasonNbr < 10 ? "0" : "") + seasonNbr + "E" + (episodeNbr < 10 ? "0" : "") + episodeNbr ;
}

function makeEpisodeSearchPanel() {
  let searchPanelDivElm = document.createElement("div");
  searchPanelDivElm.setAttribute("id", episodeSearchPanelId);

  let searchInputElm = document.createElement("input");

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
    updateEpisodeSearchResultStat(matchedEpisodes.length, localEpisodesCache["S" + currentSelectedShowId].length);
    updateEpisodeSearchResultPanel(matchedEpisodes);
    evt.target.value = "";
  });

  let SearchResultSpan = makeEpisodeSearchResultStatSpan(matchedEpisodes.length, matchedEpisodes.length);
  
  let episodeSelectHarbourDiv = document.createElement("div");

  //searchPanelDivElm.append(makeShowSelectElm(localShowsCache));

  episodeSelectHarbourDiv.setAttribute("id", "episodeSelectHarbourDivId");
  searchPanelDivElm.appendChild(episodeSelectHarbourDiv);
  
  episodeSelectHarbourDiv.appendChild(makeEpisodeSelectControl(matchedEpisodes));

  searchPanelDivElm.appendChild(searchInputElm);
  searchPanelDivElm.appendChild(SearchResultSpan);

  searchPanelDivElm.appendChild(makeResetButton());

  return searchPanelDivElm;
}

function makeResetButton() {
  let resetBtn = document.createElement("button");
  resetBtn.innerText = "Go back and search more shows";
  resetBtn.addEventListener("click", () => {
    console.log("resetBtn clicked");
    hideShowSelectionArea(false);
  });
  return resetBtn;
}

function updateEpisodeSearchResultPanel(matchedEpisodes) {
  removeEpisodeSearchResultPanel();
  document.getElementById(episodeProcessingAreaId).appendChild(makeEpisodeSearchResultPanel(matchedEpisodes));
}

function updateEpisodeSearchResultStat(episodeFound, totalEpisode) {
  document.getElementById(episodeSearchResultStat).innerHTML
  = `Displaying ${episodeFound}/${totalEpisode} episodes`;
}

function makeEpisodeSearchResultStatSpan(episodeFound, totalEpisode) {
  let searchResultStatSpanElm = document.createElement("span");
  searchResultStatSpanElm.setAttribute("id",episodeSearchResultStat);
  searchResultStatSpanElm.innerHTML = `Displaying ${episodeFound}/${totalEpisode} episodes`;
  return searchResultStatSpanElm;
}

function makeEpisodeParaElm(episode) {
  let episodeDivElm = document.createElement("div");
  episodeDivElm.classList.add("episode-entry");

  let episodeNumberSpanElm = document.createElement("span");
  episodeNumberSpanElm.innerHTML = formatEpisodeCode(episode.season, episode.number);
  episodeNumberSpanElm.classList.add("episode-heading");

  let titleSpanElm = document.createElement("span");
  titleSpanElm.classList.add("episode-heading");
  titleSpanElm.innerHTML = episode.name;

  let episodeImgElm = document.createElement("img");
  episode.image != null ? episodeImgElm.src = episode.image.medium : episodeImgElm.src = "https://static.tvmaze.com/images/tvm-header-logo.png";

  let synopsisElm = document.createElement("span");
  synopsisElm.innerHTML = episode.summary;

  episodeDivElm.appendChild(episodeImgElm);

  let episodeDetailDiv = document.createElement("div");

  episodeDetailDiv.appendChild(episodeNumberSpanElm);
  episodeDetailDiv.appendChild(titleSpanElm);
  episodeDetailDiv.appendChild(synopsisElm);

  episodeDivElm.append(episodeDetailDiv);

  return episodeDivElm;
}
window.onload = setup;
