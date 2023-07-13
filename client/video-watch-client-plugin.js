function register({ registerHook, peertubeHelpers }) {
  registerHook({
    target: "action:video-watch.player.loaded",
    handler: ({ videojs, video, playlist }) => {
      console.log("soll sotiert werden:");
      console.log(video.pluginData);
      var json = extractIds(video.pluginData)
      var sortedJson = sortedData(json);
      
      //Title
      createHeaderField("Title", 2);
      createVideoInfo("Titlenotiz", sortedJson["title.note"]);
      createVideoInfo("Title", sortedJson["title.title"]);
      //createVideoInfo("Titlenotiz3", sortedJson["title.note"]);
      createVideoInfo("descriptiveTitle", sortedJson["title.descriptiveTitle"]);
      //createVideoInfo("Titlenotiz2", sortedJson["title.note"]);
      createVideoInfo("discTitle", sortedJson["title.discTitle"]);
      //createVideoInfo("Titlenotiz3", sortedJson["title.note"]);
      createLine();

      //Description
      createHeaderField("Description", 2);
      createVideoInfo("Subject", sortedJson["description.subject"]);
      createVideoInfo("Text", sortedJson["description.text"]);
      createVideoInfo("Tags", sortedJson["description.tags"]);
      createLine();
            
      //creator
      createList("Creator", sortedJson["creator"]);

      //contributor
      createList("Contributor", sortedJson["contributor"]);
      //publisher
      createList("Publisher", sortedJson["organization"]);
      

      
      //Dates
      createHeaderField("Dates", 2);
      createVideoInfo("Date Digitalisied", sortedJson["dates.dateDigitalised"]);
      createVideoInfo("Video Links", sortedJson["dates.videLinks"]);
      createHeaderField("Issued", 3);
      createVideoInfo("First Issued", sortedJson[ "dates.coverage.firstIssued"]);
      createVideoInfo("Last Issued", sortedJson[ "dates.coverage.lastIssued"]);
      
      createHeaderField("Coverage", 3);
      createVideoInfo("Date Recorded", sortedJson[ "dates.coverage.daterecorded"]);
      createVideoInfo("Location", sortedJson[ "dates.coverage.recordingLocation0"]);
      createVideoInfo("Location", sortedJson[ "dates.coverage.recordingLocation1"]);

      
      createHeaderField("PublicationHistory", 3);
      createVideoInfo("Date Recorded", sortedJson[ "dates.publicationHistory.firstPublicationChannel"]);
      createVideoInfo("Time", sortedJson[ "dates.publicationHistory.firstPublicationTime"]);
      createVideoInfo("Date", sortedJson[ "dates.publicationHistory.firstPublicationDate"]);
      createVideoInfo("ReapeatChannel", sortedJson[ "dates.publicationHistory.repeatChannel"]);

      
      createHeaderField("ArchiveData", 3);
      createVideoInfo("File Path", sortedJson["dates.archiveData.archiveFilePath"]);
      createVideoInfo("Filesize", sortedJson["dates.archiveData.filesize"]);
      createVideoInfo("Filename", sortedJson["dates.archiveData.filename"]);
      createVideoInfo("ArchiveLocation", sortedJson["dates.archiveData.archiveLocation"]);
      createLine();
      
      createHeaderField("Video Information", 2);
      createVideoInfo("Category", sortedJson["dates.videoInformation.category"]);
      createVideoInfo("Genre", sortedJson["videoInformation.genre"]);
      createVideoInfo("Language", sortedJson["videoInformation.language"]);
      createVideoInfo("Parts", sortedJson["videoInformation.parts"]);
      createVideoInfo("relation", sortedJson["videoInformation.relation"]);
      createVideoInfo("showType", sortedJson["videoInformation.showType.serie"]);
      createVideoInfo("source", sortedJson["videoInformation.source"]);
      createVideoInfo("targetGroup", sortedJson["videoInformation.targetGroup"]);
      createVideoInfo("version", sortedJson["videoInformation.version"]);
      createLine();
      
      createHeaderField("Rating", 3);
      createVideoInfo("Notes", sortedJson["videoInformation.rating.notes"]);
      createVideoInfo("ratingScaleMinValue", sortedJson["videoInformation.rating.ratingScaleMinValue"]);
      createVideoInfo("ratingScaleMaxValue", sortedJson["videoInformation.rating.ratingScaleMaxValue"]);
      createVideoInfo("ratingValue", sortedJson["videoInformation.rating.ratingScaleMaxValue"]);
      createLine();
      
      createHeaderField("Rights", 2);
      createHeaderField("Cobyright", 3);
      createVideoInfo("rightId", sortedJson["rights.cobyright.rightId"]);
      createVideoInfo("rightClearanceFlag", sortedJson["rights.cobyright.rightClearanceFlag"]);
      createVideoInfo("explotationIssues", sortedJson["rights.cobyright.explotationIssues"]);
      createVideoInfo("disclaimer", sortedJson["rights.cobyright.disclaimer"]);
      createHeaderField("coverage", 4);
      //createVideoInfo("coverage", sortedJson["rights.cobyright.coverage"]);

      
+     createHeaderField("usageRights", 3);
      createVideoInfo("rightId", sortedJson["rights.usageRights.rightId"]);
      createVideoInfo("rightClearanceFlag", sortedJson["rights.usageRights.rightClearanceFlag"]);
      createVideoInfo("explotationIssues", sortedJson["rights.usageRights.explotationIssues"]);
      createVideoInfo("disclaimer", sortedJson["rights.usageRights.disclaimer"]);
      createHeaderField("coverage", 4);
      //createVideoInfo("coverage", sortedJson["rights.cobyright.coverage"]);
      createLine();
      
    }});
}

function extractIds(flatJson){
    // Extract keys starting with prefixes and store them in a separate JSON
    const contributorJson = extractKeysStartingWithPrefixesAndIsTrue(flatJson, "contributor");
    const creatorJson = extractKeysStartingWithPrefixesAndIsTrue(flatJson, "creator"); //TODO sollten creator sein
    const organizationJson = extractKeysStartingWithPrefixesAndIsTrue(flatJson, "organization");  
    flatJson.creator = extractValues(creatorJson);
    flatJson.contributor = extractValues(contributorJson);
    flatJson.organization = extractValues(organizationJson);

    return flatJson;
}

function sortedData(pluginData){
  const order = ['title', 'creator', 'contributor', 'organization', 'description', 'dates', 'videoInformation', 'rights', 'metadataProvider', 'technicalData'];
  let sortedJson = {};
  order.forEach(key => {
    Object.keys(pluginData).forEach(dataKey => {
      if (dataKey.toLowerCase().startsWith(key.toLowerCase())) {
        sortedJson[dataKey] = pluginData[dataKey];
      }
    });
  });
  return sortedJson;
}

function extractKeysStartingWithPrefixesAndIsTrue(flatJson, prefix) {
  const extractedJson = {};

  for (const key in flatJson) {
    if (key.startsWith(prefix)) {
      if (flatJson[key] === "true"){
        extractedJson[key] = flatJson[key];
      }
      delete flatJson[key];
    }
  }

  return extractedJson;
}

function extractValues(keys) {
  const result = [];
  console.log(keys);
  for (const key in keys) {
    console.log(key);
    if (keys.hasOwnProperty(key)) {
      const id = extractId(key);
      const name = extractName(key);

      if (id !== null && name !== null) {
        result.push({ id, name });
      }
    }
  }

  return result;
}

//TODO checken ob es passt, nochmal neu
function extractId(key) {
  const idParts = key.split("-");
  const extractedId = idParts[1] + "-" + idParts[2] + "-" + idParts[3] + "-" + idParts[4] + "-" + idParts[5];
  return extractedId;
}

function extractName(key) {
  const nameParts = key.split("-");
  return nameParts[nameParts.length - 1];
}

function createList(listname, array){
  createHeaderField(listname, 2);
  if (array.length === 0){
    createVideoInfo(listname, "undefined");
    createLine();
  } else {
  array.map((element) => {
    createVideoInfo("Id", element.id);
    createVideoInfo("Name", element.name);
    createLine();
  });
}
}
      
function createLine() {
  const myLine = document.querySelector("my-video-attributes");
  const newLine = document.createElement("div");
  newLine.classList.add("line");
  newLine.innerHTML = `<hr>`;
  myLine.appendChild(newLine);
}

function createHeaderField(header, headerlevel) {
  // Wähle das Element aus, zu dem du das neue Feld hinzufügen möchtest 
  const myHeader = document.querySelector("my-video-attributes");

  // Erstelle das neue Feld
  const newHeader = document.createElement("div");
  newHeader.classList.add("header-field");

  // Füge den Inhalt des neuen Feldes hinzu
  newHeader.innerHTML = `
    <h${headerlevel} class="header-label">${header}</h${headerlevel}>
  `;

  // Füge das neue Header am Ende des my-header-Elements hinzu
  myHeader.appendChild(newHeader);
}

function createVideoInfo(label, value) {
  // Wähle das Element aus, zu dem du das neue Feld hinzufügen möchtest 
  const myVideoAttributes = document.querySelector("my-video-attributes");

  // Erstelle das neue Feld
  const newField = document.createElement("div");
  newField.classList.add("attribute-ebu");

  // Füge den Inhalt des neuen Feldes hinzu
  newField.innerHTML = `
<span class="attribute-label-ebu">${label}</span>
<span class="attribute-value-ebu">${value}</span>
`;

  // Füge das neue Feld am Ende des my-video-attributes-Elements hinzu
  myVideoAttributes.appendChild(newField);
}

/* function translate(key){
  return peertubeHelpers.translate(key);
} */

export { register };
