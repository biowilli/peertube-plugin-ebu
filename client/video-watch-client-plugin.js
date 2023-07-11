function register({ registerHook, peertubeHelpers }) {
  registerHook({
    target: "action:video-watch.player.loaded",
    handler: ({ videojs, video, playlist }) => {
      // Match all nodes
      console.log("update view");
      console.log(video.pluginData);

      unflattenJSON(video.pluginData);
    },
  });
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

function extractKeysStartingWithPrefixes(flatJson, prefix) {
  const extractedJson = {};

  for (const key in flatJson) {
    if (key.startsWith(prefix)) {
      extractedJson[key] = flatJson[key];
      delete flatJson[key];
    }
  }

  return extractedJson;
}


function unflattenJSON(flatJson) {
  const nestedJson = {};
  
  // Extract keys starting with prefixes and store them in a separate JSON
  const contributorJson = extractKeysStartingWithPrefixes(flatJson, "contributor");
  const creatorJson = extractKeysStartingWithPrefixes(flatJson, "creator");
  const organizationJson = extractKeysStartingWithPrefixes(flatJson, "organization");

  console.log(contributorJson);
  console.log(creatorJson);
  console.log(organizationJson);
  
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
  
  createHtml(nestedJson);
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

export { register };
