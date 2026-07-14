const express = require("express");

const upload = require("../middleware/uploadMiddleware");
const { uploadDocument } = require("../controllers/uploadController");

const router = express.Router();

router.post("/upload", upload.single("document"), uploadDocument);

module.exports = router;