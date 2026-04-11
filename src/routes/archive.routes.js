const router = require("express").Router();
const ctrl = require("../controllers/archive.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, ctrl.getArchive);
router.post("/", auth, ctrl.createArchive);
router.delete("/:id", auth, ctrl.deleteArchive);

module.exports = router;
