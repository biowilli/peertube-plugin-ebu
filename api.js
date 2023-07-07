//TODO const { v4: uuidv4 } = require('uuid');
//TODO console.log("uuidv4():", uuidv4());

//Löschen aus den bisherigen Elementen

const initGenreController = (router, storageManager) => {
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
}

const initOrganizationController = (router, storageManager) => {
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
}

module.exports = {
  initGenreController,
  initOrganizationController,
};
