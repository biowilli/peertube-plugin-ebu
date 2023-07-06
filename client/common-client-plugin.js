async function register({
  registerClientRoute,
  registerHook,
  registerVideoField,
  peertubeHelpers,
}) {
  registerHook({
    target: "filter:left-menu.links.create.result",
    handler: (links) => {
      var newlinksection = {
        key: "metadata",
        title: "Metadata Plugin",
        links: [
          {
            icon: "home",
            path: "/p/metadata/genre",
            shortLabel: "Genre",
          },
          {
            icon: "home",
            path: "/p/metadata/organizations",
            shortLabel: "Organiztations",
          },
          {
            icon: "home",
            path: "/admin/plugins/show/peertube-plugin-ebu",
            shortLabel: "Settings",
          },
        ],
      };

      links.push(newlinksection);

      return links;
    },
  });

  registerClientRoute({
    route: "metadata/genre",
    onMount: ({ rootEl }) => {
      rootEl.innerHTML = `
      <h1>Genre</h1>
      <input type="text" id="genrename" name="genrename"></input>
      <button id="myButton">Genre hinzufügen</button>
      <div id="genreContainer"></div>
      <table id="myTable">
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </table>
    `;

      function getGenre() {
        const table = rootEl.querySelector("#myTable");
        const tableBody = table.querySelector("tbody");
        if (tableBody) {
          tableBody.remove();
        }

        fetch(peertubeHelpers.getBaseRouterRoute() + "/genre/all", {
          method: "GET",
          headers: peertubeHelpers.getAuthHeader(),
        })
          .then((res) => res.json())
          .then((data) => {
            var genre = data.data;
            const genreContainer = rootEl.querySelector("#genreContainer");
            if (genre.length == 0) {
              genreContainer.textContent = "Noch keine Genre vorhanden";
              return;
            } else {
              genreContainer.textContent = "";
            }
            const newTableBody = document.createElement("tbody");

            genre.forEach((genre) => {
              const tableRow = document.createElement("tr");
              tableRow.innerHTML = `
                <td>${genre.id}</td>
                <td>${genre.name}</td>
                <td>
                  <button class="deleteButton" data-id="${genre.id}">Löschen</button>
                </td>
              `;
              newTableBody.appendChild(tableRow);
            });

            table.appendChild(newTableBody);

            const deleteButtons = rootEl.querySelectorAll(".deleteButton");
            deleteButtons.forEach((button) => {
              button.addEventListener("click", () => {
                const genreId = button.dataset.id;
                console.log("Löschen der Genre mit ID:", genreId);

                fetch(
                  peertubeHelpers.getBaseRouterRoute() +
                    "/genre/delete/" +
                    genreId,
                  {
                    method: "DELETE",
                    headers: peertubeHelpers.getAuthHeader(),
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    console.log("Erfolgreich gelöscht:", data);
                    getGenre();
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
      getGenre();
      const button = rootEl.querySelector("#myButton");
      button.addEventListener("click", () => {
        const genreNameInput = rootEl.querySelector("#genrename");
        const genresName = genreNameInput.value;
        console.log(genresName);
        fetch(peertubeHelpers.getBaseRouterRoute() + "/genre/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...peertubeHelpers.getAuthHeader(),
          },
          body: JSON.stringify({ name: genresName }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Erfolgreich erstellt:", data);
            getGenre();
          })
          .catch((error) => {
            console.log("Fehler beim Erstellen:", error);
          });
      });

      // CSS-Stile der Seite
      const style = document.createElement("style");
      style.innerHTML = `
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

  registerClientRoute({
    route: "metadata/organizations",
    onMount: ({ rootEl }) => {
      rootEl.innerHTML = `
      <h1>Organizations</h1>
      <input type="text" id="organisationsname" name="organisationsname"></input>
      <button id="myButton">Organisation hinzufügen</button>
      <div id="organisationsContainer"></div>
      <table id="myTable">
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </table>
    `;

      function getOrganisations() {
        const table = rootEl.querySelector("#myTable");
        const tableBody = table.querySelector("tbody");
        if (tableBody) {
          tableBody.remove();
        }

        fetch(peertubeHelpers.getBaseRouterRoute() + "/organization/all", {
          method: "GET",
          headers: peertubeHelpers.getAuthHeader(),
        })
          .then((res) => res.json())
          .then((data) => {
            var organisations = data.data;
            const organisationsContainer = rootEl.querySelector(
              "#organisationsContainer"
            );
            if (organisations.length == 0) {
              organisationsContainer.textContent =
                "Noch keine Organisation vorhanden";
              return;
            } else {
              organisationsContainer.textContent = "";
            }
            const newTableBody = document.createElement("tbody");

            organisations.forEach((organisation) => {
              const tableRow = document.createElement("tr");
              tableRow.innerHTML = `
                <td>${organisation.id}</td>
                <td>${organisation.name}</td>
                <td>
                  <button class="deleteButton" data-id="${organisation.id}">Löschen</button>
                </td>
              `;
              newTableBody.appendChild(tableRow);
            });

            table.appendChild(newTableBody);

            const deleteButtons = rootEl.querySelectorAll(".deleteButton");
            deleteButtons.forEach((button) => {
              button.addEventListener("click", () => {
                const organizationId = button.dataset.id;
                console.log("Löschen der Organisation mit ID:", organizationId);

                fetch(
                  peertubeHelpers.getBaseRouterRoute() +
                    "/organization/delete/" +
                    organizationId,
                  {
                    method: "DELETE",
                    headers: peertubeHelpers.getAuthHeader(),
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    console.log("Erfolgreich gelöscht:", data);
                    getOrganisations();
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
      getOrganisations();
      const button = rootEl.querySelector("#myButton");
      button.addEventListener("click", () => {
        const organisationsnameInput =
          rootEl.querySelector("#organisationsname");
        const organizationsname = organisationsnameInput.value;
        console.log(organizationsname);
        fetch(peertubeHelpers.getBaseRouterRoute() + "/organization/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...peertubeHelpers.getAuthHeader(),
          },
          body: JSON.stringify({ name: organizationsname }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Erfolgreich erstellt:", data);
            getOrganisations();
          })
          .catch((error) => {
            console.log("Fehler beim Erstellen:", error);
          });
      });

      // CSS-Stile der Seite
      const style = document.createElement("style");
      style.innerHTML = `
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

  function getData() {
    const fetchUsers = fetch("http://localhost:9000/api/v1/users", {
      method: "GET",
      headers: peertubeHelpers.getAuthHeader(),
    }).then((response) => response.json());

    const fetchOrganizations = fetch(
      peertubeHelpers.getBaseRouterRoute() + "/organization/all",
      {
        method: "GET",
        headers: peertubeHelpers.getAuthHeader(),
      }
    ).then((response) => response.json());

    const fetchGenre = fetch(
      peertubeHelpers.getBaseRouterRoute() + "/genre/all",
      {
        method: "GET",
        headers: peertubeHelpers.getAuthHeader(),
      }
    ).then((response) => response.json());

    Promise.all([fetchUsers, fetchOrganizations, fetchGenre]).then(
      ([usersResponse, organizationsResponse, genreResponse]) => {
        const users = usersResponse.data;
        const organizations = organizationsResponse.data;
        const genre = genreResponse.data;
        const genreOptions = genre.map((x) => {
          return { label: x.name, value: x.id };
        });

        console.log(genreOptions);

        for (const type of [
          "upload",
          "import-url",
          "import-torrent",
          "update",
          "go-live",
        ]) {
          const videoFormOptions = {
            // type: 'main' | 'plugin-settings'
            tab: "plugin-settings",
          };

          //Headline Title
          registerVideoField(
            {
              type: "html",
              html: "<h2>Title</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          registerVideoField(
            {
              name: "title",
              label: "Title",
              descriptionHTML: "Title",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          registerVideoField(
            {
              name: "descriptiveTitle",
              label: "Descriptive Title",
              descriptionHTML: "Beschreibender Titel",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          registerVideoField(
            {
              name: "discTitle",
              label: "Alternative Title",
              descriptionHTML: "Untertitel",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          //Headline Creator
          registerVideoField(
            {
              type: "html",
              html: "<h2>Creator</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          users.map((user) => {
            registerVideoField(
              {
                name: "user" + user.userid,
                label: user.username,
                type: "input-checkbox",
                hidden: false,
                error: false,
              },
              {
                type,
                ...videoFormOptions,
                value: false,
              }
            );
          });

          //Headline Contributors
          registerVideoField(
            {
              type: "html",
              html: "<h2>Contributors</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          users.map((user) => {
            registerVideoField(
              {
                name: "user" + user.id,
                label: user.username,
                type: "input-checkbox",
                hidden: false,
                error: false,
              },
              {
                type,
                ...videoFormOptions,
                value: false,
              }
            );
          });

          //Headline Publisher
          registerVideoField(
            {
              type: "html",
              html: "<h2>Publisher</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          organizations.map((organisation) => {
            registerVideoField(
              {
                name: "organization" + organisation.id,
                label: organisation.name,
                type: "input-checkbox",
                hidden: false,
                error: false,
              },
              {
                type,
                ...videoFormOptions,
                value: false,
              }
            );
          });

          //Headline Description
          registerVideoField(
            {
              type: "html",
              html: "<h2>Description</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          registerVideoField(
            {
              name: "tags",
              label: "Tags",
              descriptionHTML: "Tags mit ',' trennen",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          registerVideoField(
            {
              name: "subject",
              label: "Subject",
              descriptionHTML: "Betreff",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          registerVideoField(
            {
              name: "text",
              label: "text",
              descriptionHTML: "Text",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          //Headline Dates
          registerVideoField(
            {
              type: "html",
              html: "<h2>Dates</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          //Headline coverage
          registerVideoField(
            {
              type: "html",
              html: "<h3>coverage</h3>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          registerVideoField(
            {
              name: "daterecorded",
              label: "daterecorded",
              descriptionHTML: "Date recorded",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          //TODO set multiple locations
          organizations.map((organisation, index) => {
            registerVideoField(
              {
                name: "location" + index,
                label: "location" + index,
                type: "input-checkbox",
                hidden: false,
                error: false,
              },
              {
                type,
                ...videoFormOptions,
                value: false,
              }
            );
          });

          //Headline Issued
          registerVideoField(
            {
              type: "html",
              html: "<h3>Issued</h3>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          registerVideoField(
            {
              name: "first issued",
              label: "first issued",
              descriptionHTML: "First Issued",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "last issued",
              label: "last issued",
              descriptionHTML: "Last Issued",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "date digitalised",
              label: "date digitalised",
              descriptionHTML: "Date digitalised",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "video links",
              label: "video links",
              descriptionHTML: "Video Link(s)",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "filename",
              label: "filename",
              descriptionHTML: "Filename",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          //Headline Video Information
          registerVideoField(
            {
              type: "html",
              html: "<h2>Video Information</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "genre",
              label: "genre",
              descriptionHTML: "Genre",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "targetgroup",
              label: "targetgroup",
              descriptionHTML: "Zielgruppe",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          //Headline Issued
          registerVideoField(
            {
              type: "html",
              html: "<h3>Show Type</h3>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "series",
              label: "series",
              descriptionHTML: "Series",
              type: "select",
              options: [
                { label: "Season", value: "season" },
                { label: "Episode", value: "episode" },
              ],

              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "genre",
              label: "genre",
              descriptionHTML: "genre",
              type: "select",
              options: genreOptions,

              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          //Headline Rights
          registerVideoField(
            {
              type: "html",
              html: "<h2>Rights</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              type: "html",
              html: "<h3>Copyright</h3>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              type: "html",
              html: "<h4>Coverage</h4>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "startDate",
              label: "startDate",
              descriptionHTML: "Start Datum",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "endDate",
              label: "endDate",
              descriptionHTML: "End Datum",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
          //TODO Locations
          registerVideoField(
            {
              name: "locations",
              label: "locations",
              descriptionHTML: "locations",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              type: "html",
              html: "<h4>Right Holder</h4>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              type: "html",
              html: "<h3>usage rights</h3>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          //Headline Metadata provider
          registerVideoField(
            {
              type: "html",
              html: "<h2>Metadata provider</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              type: "html",
              html: "<h3>Show Type</h3>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          //Headline Technical data
          registerVideoField(
            {
              type: "html",
              html: "<h2>Technical data</h2>",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );

          registerVideoField(
            {
              name: "videoformat",
              label: "videoformat",
              descriptionHTML: "with",
              type: "input",
              default: "",
              hidden: false,
              error: false,
            },
            {
              type,
              ...videoFormOptions,
            }
          );
        }
      }
    );
  }

  getData();
}

export { register };
