function register({ registerHook, peertubeHelpers }) {
  registerHook({
    target: "action:video-watch.player.loaded",
    handler: ({ videojs, video, playlist }) => {
      // Match all nodes
      console.log("update view");
      console.log(video.pluginData);

      var data = video.pluginData;
      Object.keys(data).forEach((key) => {
        const value = data[key];
        console.log(key, value);
        //createVideoInfo(key, value);
      });
    },
  });
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
