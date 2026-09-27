import multer from "multer";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

// os.tmpdir() is always writable on Render (and everywhere else) — a
// relative "uploads/temp" path depends on the working directory the process
// was started from, which varies by host.
const TEMP_DIR = path.join(os.tmpdir(), "pulseline-uploads");

// Multer writes here first; cloudinary.js uploads from this path and then
// deletes the temp file, so the folder just needs to exist at startup.
fs.mkdirSync(TEMP_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, TEMP_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf"];

function imageFilter(_req, file, cb) {
  if (IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only JPEG, PNG, or WEBP images are allowed."));
}

function documentFilter(_req, file, cb) {
  if (DOCUMENT_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only JPEG, PNG, WEBP, or PDF files are allowed."));
}

/** Single profile photo — auth profile avatar. */
export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single("avatar");

/** Single document — e.g. one medical report file. */
export const uploadSingle = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter,
}).single("file");

/** Multiple documents at once — e.g. a patient's uploaded medical documents. */
export const uploadMultiple = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter,
}).array("files", 5);

/** Named field groups — one form submitting several distinct file types together. */
export const uploadFields = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFilter,
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
  { name: "documents", maxCount: 5 },
  { name: "certificates", maxCount: 10 },
  { name: "reportFile", maxCount: 1 },
]);
