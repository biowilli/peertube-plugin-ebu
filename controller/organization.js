const { v4: uuidv4 } = require('uuid');

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
      console.log("existingOrganizations");
      console.log(existingOrganizations);
      console.log("req.body");
      console.log(req.body);
      var organizationname = await req.body.name;
      var newData = {
        id: uuidv4(),
        name: organizationname,
      };  
      if (existingOrganizations == undefined) {
        await storageManager.storeData("organizations", {
          data: [newData],
        });

        res.send(newData);
        return;
      }

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
  initOrganizationController
};
