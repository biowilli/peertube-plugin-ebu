function register({ registerHook, peertubeHelpers }) {
  registerHook({
    target: "action:video-watch.player.loaded",
    handler: ({ videojs, video, playlist }) => {
      console.log("soll sotiert werden:");
      console.log(video.pluginData);
      var json = extractIds(video.pluginData)
      var sortedJson = sortedData(json);
      unflattenJSON(sortedJson);
    },
  });
}

function extractIds(flatJson){
    // Extract keys starting with prefixes and store them in a separate JSON
    const contributorJson = extractKeysStartingWithPrefixesAndIsTrue(flatJson, "contributor");
    const creatorJson = extractKeysStartingWithPrefixesAndIsTrue(flatJson, "creator"); //TODO sollten creator sein
    const organizationJson = extractKeysStartingWithPrefixesAndIsTrue(flatJson, "organization");
  
    console.log("contributorJson", contributorJson);
    console.log("creatorJson", creatorJson);
    console.log("organizationJson", organizationJson);
    console.log("flatJson", flatJson);
  
    const creatorResult = extractValues(creatorJson);
    const contributorResult = extractValues(contributorJson);
    const organizationResult = extractValues(organizationJson);
  
    console.log('Creator Result:', creatorResult);
    console.log('Contributor Result:', contributorResult);
    console.log('Organization Result:', organizationResult);

    flatJson.creator = creatorResult;
    flatJson.contributor = contributorResult;
    flatJson.organization = organizationResult;

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


function unflattenJSON(flatJson) {
  const nestedJson = {};
  
  for (const key in flatJson) {

    if (key.includes(".")) {
      const nestedKeys = key.split(".");
      let currentNestedJson = nestedJson;

      for (let i = 0; i < nestedKeys.length - 1; i++) {
        const nestedKey = nestedKeys[i];

        if (!currentNestedJson[nestedKey]) {
          currentNestedJson[nestedKey] = {};
        }

        currentNestedJson = currentNestedJson[nestedKey];
      }

      currentNestedJson[nestedKeys[nestedKeys.length - 1]] =
        flatJson[key] !== undefined ? flatJson[key] : "-";
    } else {
      nestedJson[key] = flatJson[key] !== undefined ? flatJson[key] : "-";
    }
  }
  console.log("nestedJson",nestedJson);

  createHtml(nestedJson);
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

function createHtml(data, level = 1) {
  for (const key in data) {
    const value = data[key];

    // Erzeugen Sie die Überschrift basierend auf dem aktuellen Level
    createHeaderField(key, level);

    // Überprüfen, ob der Wert ein Objekt ist (nicht leer)
    if (typeof value === 'object' && Object.keys(value).length > 0) {
      // Wenn das Objekt das letzte Level ist, rufen Sie createVideoInfo auf
      if (Object.values(value).every(v => typeof v === 'string')) {
        for (const subKey in value) {
          createVideoInfo(subKey, value[subKey]);
        }
      } else {
        // Wenn das Objekt nicht das letzte Level ist, rufen Sie createHtml rekursiv auf
        createHtml(value, level + 1);
      }
    } else {
      // Wenn der Wert ein String ist, rufen Sie createVideoInfo auf
      createVideoInfo(key, value);
    }
  }
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
