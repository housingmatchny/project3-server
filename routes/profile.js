//Tenant Profile Page + links to personal page and preferences page

var express = require("express");
var router = express.Router();
const Tenant = require("../models/Tenant");

const isAuthenticated = require('../middleware/isAuthenticated')


//GET TENANT PROFILE 
router.get("/:tenantId", isAuthenticated, (req, res, next) => {
  const { tenantId } = req.params;

  //check if the tenant exists
  if (!mongoose.Types.ObjectId.isValid(tenantId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

Tenant.findById(tenantId)
.populate("reviews listings") //.populate("reviews ratings listings") when those collections are registered; populating before those collections exist or have any data will cause errors
.then((populatedProfile) => res.status(200).json(populatedProfile))
.catch((error) => res.json(error));
});


//UPDATE PREFERENCES PAGE
router.put("/:tenantId/preferences", isAuthenticated, (req, res, next) => {
const { tenantId } = req.params;

Tenant.findByIdAndUpdate(tenantId, req.body, { new: true })
.then((updatedPrefs) => {
    res.json(updatedPrefs)
})
.catch((error) => res.json(error));
});

//UPDATE PERSONAL PAGE
router.put("/:tenantId/personal", isAuthenticated, (req, res, next) => {
const { tenantId } = req.params;

if (!mongoose.Types.ObjectId.isValid(tenantId)) {
res.status(400).json({ message: "Specified id is not valid" });
return;
}

Tenant.findByIdAndUpdate(tenantId, req.body, { new: true })
.then((updatedPersonalInfo) => {
    res.json(updatedPersonalInfo)
})
.catch((error) => res.json(error));
});


//DELETE ACCOUNT from Personal Page
router.delete("/:tenantId/personal", isAuthenticated, (req, res, next) => {
  const { tenantId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tenantId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Tenant.findByIdAndRemove(tenantId)
    .then((deleted) =>
      res.json({
        deleted,
        message: `Tenant Profile with ${tenantId} has been removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});


module.exports = router;
