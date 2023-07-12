const { v4: uuidv4 } = require('uuid');

const initCreatorController = (router, storageManager) => {
  router.get("/creator/all", async (req, res) => {
      try {
        var storedData = await storageManager.getData("creator");
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

  router.post("/creator/create", async (req, res) => {
    try {
      var existingCreator = await storageManager.getData("creator");
      var creatorname = await req.body.name;
      var newData = {
        id: uuidv4(),
        name: creatorname,
      };
      if (existingCreator == undefined) {
        await storageManager.storeData("creator", {
          data: [newData],
        });

        res.send(newData);
        return;
      }

      existingCreator.data.push(newData);
      await storageManager.storeData("creator", existingCreator);

      res.send(newData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.delete("/creator/delete/:id", async (req, res) => {
    try {
      var existingCreator = await storageManager.getData("creator");
      var creatorId = req.params.id;

      if (existingCreator == undefined) {
        res
          .status(404)
          .json({ success: false, message: "Creator nicht gefunden." });
        return;
      }

      var creatorIndex = existingCreator.data.findIndex((org) => org.id == creatorId);
      if (creatorIndex !== -1) {
        existingCreator.data.splice(creatorIndex, 1);
        await storageManager.storeData("creator", existingCreator);
        res.status(200).json({
          success: true,
          message: "Creator erfolgreich gelöscht.",
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Creator nicht gefunden." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
}

module.exports = {
  initCreatorController
};
