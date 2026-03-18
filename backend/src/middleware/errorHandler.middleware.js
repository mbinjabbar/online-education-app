import multer from "multer";

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "Image must be 2MB or smaller" });
    }
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err?.message?.startsWith("Only image files are allowed")) {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
};