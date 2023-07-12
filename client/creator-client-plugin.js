async function register({
  registerClientRoute,
  peertubeHelpers,
}) {

    registerClientRoute({
        route: "metadata/creators",
        onMount: ({ rootEl }) => {
          rootEl.innerHTML = `
          <div id="plugincontainer">
          <h1>Creator</h1>
          <input type="text" id="creatorname" name="creatorname"></input>
          <button id="myButton">Creator hinzufügen</button>
          <div id="creatorContainer"></div>
          <table id="myTable">
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </table>
          <div>
        `;
    
          function getCreator() {
            const table = rootEl.querySelector("#myTable");
            const tableBody = table.querySelector("tbody");
            if (tableBody) {
              tableBody.remove();
            }
    
            fetch(peertubeHelpers.getBaseRouterRoute() + "/creator/all", {
              method: "GET",
              headers: peertubeHelpers.getAuthHeader(),
            })
              .then((res) => res.json())
              .then((data) => {
                var creator = data.data;
                const creatorContainer = rootEl.querySelector("#creatorContainer");
                if (creator.length == 0) {
                  creatorContainer.textContent = "Noch keine Creator vorhanden";
                  return;
                } else {
                  creatorContainer.textContent = "";
                }
                const newTableBody = document.createElement("tbody");
                const tableHeaderRow = document.createElement("tr");
                tableHeaderRow.innerHTML = `
                  <th>ID</th>
                  <th>Name</th>
                  <th></th>
                `;
                newTableBody.appendChild(tableHeaderRow);
    
                creator.forEach((creator) => {
                  const tableRow = document.createElement("tr");
                  tableRow.innerHTML = `
                    <td>${creator.id}</td>
                    <td>${creator.name}</td>
                    <td>
                      <button class="deleteButton" data-id="${creator.id}">Löschen</button>
                    </td>
                  `;
                  newTableBody.appendChild(tableRow);
                });
    
                table.appendChild(newTableBody);
    
                const deleteButtons = rootEl.querySelectorAll(".deleteButton");
                deleteButtons.forEach((button) => {
                  button.addEventListener("click", () => {
                    const creatorId = button.dataset.id;
                    console.log("Löschen der Creator mit ID:", creatorId);
    
                    fetch(
                      peertubeHelpers.getBaseRouterRoute() +
                        "/creator/delete/" +
                        creatorId,
                      {
                        method: "DELETE",
                        headers: peertubeHelpers.getAuthHeader(),
                      }
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        console.log("Erfolgreich gelöscht:", data);
                        getCreator();
                      })
                      .catch((error) => {
                        console.log("Fehler beim Löschen:", error);
                      });
                  });
                });
              })
              .catch((error) => {
                console.log("Error:", error);
              });
          }
          getCreator();
          const button = rootEl.querySelector("#myButton");
          button.addEventListener("click", () => {
            const creatorNameInput = rootEl.querySelector("#creatorname");
            const creatorsName = creatorNameInput.value;
            console.log(creatorsName);
            fetch(peertubeHelpers.getBaseRouterRoute() + "/creator/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...peertubeHelpers.getAuthHeader(),
              },
              body: JSON.stringify({ name: creatorsName }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Erfolgreich erstellt:", data);
                getCreator();
              })
              .catch((error) => {
                console.log("Fehler beim Erstellen:", error);
              });
          });
    
          // CSS-Stile der Seite
          const style = document.createElement("style");
          style.innerHTML = `
          #plugincontainer {
            width: fit-content;
          }
          
          h1 {
            color: blue;
          }
          p {
            font-size: 18px;
          }
    
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }
    
        table tr {
          text-align: left;
      }
      table th,
      table td {
        padding: 12px 15px;
    }
        `;
          rootEl.appendChild(style);
        },
      });
}


export { register };
