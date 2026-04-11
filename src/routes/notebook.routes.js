const router = require("express").Router();
const ctrl = require("../controllers/notebook.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, ctrl.createNotebook);
router.get("/", auth, ctrl.getNotebooks);
router.get("/public", auth, ctrl.getPublicNotebooks);
router.get("/:identifier", auth, ctrl.getNotebook);
router.post("/:notebookId/add-article", auth, ctrl.addArticleToNotebook);
router.patch("/:notebookId/pages/:pageId", auth, ctrl.updatePageNotes);
router.put("/:id", auth, ctrl.updateNotebook);
router.delete("/:id", auth, ctrl.deleteNotebook);
router.delete("/:notebookId/pages/:pageId", auth, ctrl.deletePage);

module.exports = router;