async function register({
  registerHook,
  storageManager,
  registerSetting,
  baseStaticUrl,
  getRouter,
}) {
  const router = getRouter();

  router.get("/genre/all", async (req, res) => {
    try {
      var storedData = await storageManager.getData("genre");
      if (storedData == null) {
        res.send({});
        return;
      }
      res.send(storedData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post("/genre/create", async (req, res) => {
    try {
      var existingGenre = await storageManager.getData("genre");
      var genrename = await req.body.name;
      if (existingGenre == undefined) {
        var newData = {
          id: 0,
          name: genrename,
        };
        await storageManager.storeData("genre", {
          counter: 0,
          data: [newData],
        });

        res.send(newData);
        return;
      }
      var newId = existingGenre.counter + 1;
      var newData = {
        id: newId,
        name: genrename,
      };

      existingGenre.counter = newId;
      existingGenre.data.push(newData);
      await storageManager.storeData("genre", existingGenre);

      res.send(newData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.delete("/genre/delete/:id", async (req, res) => {
    try {
      var existingGenre = await storageManager.getData("genre");
      var genreId = req.params.id;

      if (existingGenre == undefined) {
        res
          .status(404)
          .json({ success: false, message: "Genre nicht gefunden." });
        return;
      }

      var genreIndex = existingGenre.data.findIndex((org) => org.id == genreId);
      if (genreIndex !== -1) {
        existingGenre.data.splice(genreIndex, 1);
        await storageManager.storeData("genre", existingGenre);
        res.status(200).json({
          success: true,
          message: "Genre erfolgreich gelöscht.",
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Genre nicht gefunden." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/organization/all", async (req, res) => {
    try {
      var storedData = await storageManager.getData("organizations");
      if (storedData == null) {
        res.send({});
        return;
      }
      res.send(storedData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post("/organization/create", async (req, res) => {
    try {
      var existingOrganizations = await storageManager.getData("organizations");
      var organizationname = await req.body.name;
      if (existingOrganizations == undefined) {
        var newData = {
          id: 0,
          name: organizationname,
        };
        await storageManager.storeData("organizations", {
          counter: 0,
          data: [newData],
        });

        res.send(newData);
        return;
      }
      var newId = existingOrganizations.counter + 1;
      var newData = {
        id: newId,
        name: organizationname,
      };

      existingOrganizations.counter = newId;
      existingOrganizations.data.push(newData);
      await storageManager.storeData("organizations", existingOrganizations);

      res.send(newData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.delete("/organization/delete/:id", async (req, res) => {
    try {
      var existingOrganizations = await storageManager.getData("organizations");
      var organizationId = req.params.id;

      if (existingOrganizations == undefined) {
        res
          .status(404)
          .json({ success: false, message: "Organisation nicht gefunden." });
        return;
      }

      var organizationIndex = existingOrganizations.data.findIndex(
        (org) => org.id == organizationId
      );
      if (organizationIndex !== -1) {
        existingOrganizations.data.splice(organizationIndex, 1);
        await storageManager.storeData("organizations", existingOrganizations);
        res.status(200).json({
          success: true,
          message: "Organisation erfolgreich gelöscht.",
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Organisation nicht gefunden." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  var ebuData = [
    "title",
    "alternativeTitle",
    "dateModified",
    "publicationHistory",
    "note",
    "alternativeTitle2",
    "creator",
    "contributor",
    "description",
    "subject",
    "duration",
    "identifier",
    "identifier2",
    "publisher",
    "date",
    "dateIssued",
    "dateDigitised",
    "publicationHistory2",
    "dateModified2",
    "coverage",
    "coverage2",
    "entity",
    "entity2",
    "type",
    "type2",
    "type3",
    "part",
    "part2",
    "part3",
    "language",
    "source",
    "version",
    "relation",
    "rights",
    "rightsCoverage",
    "rightsCoverage2",
    "rightsCoverage3",
    "dateModified3",
    "metadataProvider",
    "format",
    "format",
    "format2",
    "format3",
    "format4",
    "format5",
    "format6",
    "format7",
    "format8",
    "format9",
    "format10",
    "format11",
    "format12",
    "format13",
    "language2",
    "format14",
    "format15",
    "rating",
  ];

  registerSetting({
    name: "organisation",
    label: "Organization",
    type: "input",
    default: "false",
    private: "false",
  });

  ebuData.forEach(function (item, index) {
    var setting = {
      name: item,
      label: item,
      type: "input-checkbox",
      default: false,
      private: false,
    };

    registerSetting(setting);
  });

  // Store data associated to this video
  registerHook({
    target: "action:api.video.updated",
    handler: ({ video, body }) => {
      if (!body.pluginData) return;

      console.log("convert to json");
      console.log(body.pluginData);
      console.log(      "convertIntoJsonFormat");
      convertIntoJsonFormat(body.pluginData);

      Object.keys(body.pluginData).forEach(function (key) {
        const value = body.pluginData[key];
        if (!value) return;
        storageManager.storeData(key + "-" + video.id, value);
      });
    },
  });

  // Add your custom value to the video, so the client autofill your field using the previously stored value
  registerHook({
    target: "filter:api.video.get.result",
    handler: async (video) => {
      if (!video) return video;
      if (!video.pluginData) video.pluginData = {};
      console.log("video out");
      console.log(video);
      const promises = ebuData.map(async (ebuField) => {
        var storedData = await storageManager.getData(
          ebuField + "-" + video.id
        );

        if (ebuField == "title") {
          video.pluginData[ebuField] = video.dataValues.name;
          return;
        }

        if (ebuField == "duration") {
          video.pluginData[ebuField] = video.dataValues.duration;
          return;
        }

        video.pluginData[ebuField] = storedData;
      });

      await Promise.all(promises);

      const sortedPluginData = {};
      ebuData.forEach((ebuField) => {
        sortedPluginData[ebuField] = video.pluginData[ebuField];
      });

      video.pluginData = sortedPluginData;
      return video;
    },
  });
}

function convertIntoJsonFormat(data) {
  // Konvertiere das Objekt in ein JSON-Format
  const json = JSON.stringify(data);
  console.log(json);
  //TODO Notes and publicationHistory mal weggelassen

  //TODO add note and descriptive title
  title = {
    title: data.title,
    alternativeTitle: data.alternativeTitle,
    descriptiveTitle: data.descriptiveTitle,
  };

  //TODO multiple Creators and multiple Contributor
  contact = {
    id: "",
    firstname: "",
    lastname: "",
    webadress: "",
    stageName: "",
  };

  const sortedKeys = filterKeysByPrefixAndValue(data);
  console.log('User keys:', sortedKeys.userKeys);
  console.log('Contributor keys:', sortedKeys.contributorKeys);
  console.log('Organization keys:', sortedKeys.organizationKeys);

  const creatorResult = extractValues(sortedKeys.userKeys);
  const contributorResult = extractValues(sortedKeys.contributorKeys);
  const organizationResult = extractValues(sortedKeys.organizationKeys);

  console.log('User Result:', creatorResult);
  console.log('Contributor Result:', organizationResult);
  console.log('Organization Result:', contributorResult);

  //TODO Publisher
  organisation = {
    id: "",
    name: "",
  };

  publisher = [];
  //push organisation

  //TODO Description
  //TODO multiple Tags
  tags = [];
  //push tags
  description = {
    tags: tags,
    subject: data.subject,
    text: data.text,
  };

  //TODO Dates
  //TODO Video Information
  //TODO Rights
  //TODO Metadata provider
  //TODO Technical data

  transformedData = {
    title: title,
    creator: creatorResult,
    contributor: contributorResult,
    publisher: organizationResult,
  };
  console.log("v1_transformedData");
  console.log(transformedData);
}

function filterKeysByPrefixAndValue(obj) {
  let userKeys = [];
  let organizationKeys = [];
  let contributorKeys = [];

  for (const key in obj) {
    if (obj[key] === 'true') {
      if (key.startsWith('user')) {
        userKeys.push(key);
      } else if (key.startsWith('contributor')) {
        contributorKeys.push(key);
      } else if (key.startsWith('organization')) {
        organizationKeys.push(key);
      } 
    }
  }

  return { userKeys, contributorKeys, organizationKeys };
}

function extractValues(keys) {
  const result = [];

  for (const key of keys) {
    const id = extractId(key);
    const name = extractName(key);

    if (id !== null && name !== null) {
      result.push({ id, name });
    }
  }

  return result;
}

function extractId(key) {
  const idMatch = key.match(/-(.+?)-/);
  return idMatch ? idMatch[1] : null;
}

function extractName(key) {
  const nameMatch = key.match(/-\s*([A-Za-z]+)$/);
  return nameMatch ? nameMatch[1] : null;
}

module.exports = {
  register,
  unregister,
};

async function unregister() {
  return;
}
