import Video from "../models/Video.model.js";
import Subject from "../models/Subject.model.js";

// GET /api/videos/subject/:subjectId
export const getVideos = async (req, res, next) => {
  try {
    const { subjectId } = req.query;
 
    if (!subjectId) {
      return res.status(400).json({ success: false, message: "subjectId query parameter is required" });
    }
 
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
 
    const videos = await Video.findAll({ where: { subjectId } });
    res.set("Cache-Control", "no-store");
    res.status(200).json({ success: true, data: { videos } });
  } catch (err) {
    next(err);
  }
};

// POST /api/videos
export const createVideo = async (req, res, next) => {
  try {
    const { title, bannerUrl, url, subjectId } = req.body;

    if (!title || !bannerUrl || !url || !subjectId) {
      return res.status(400).json({ success: false, message: "title, bannerUrl, url and subjectId are required" });
    }

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    const video = await Video.create({
      title,
      bannerUrl,
      url,
      subjectId,
      subjectName: subject.title
    });

    res.status(201).json({ success: true, message: "Video created successfully", data: { video } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/videos/:id
export const updateVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, bannerUrl, url, subjectId } = req.body;

    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    let subjectName = video.subjectName;
    if (subjectId && subjectId !== video.subjectId) {
      const subject = await Subject.findByPk(subjectId);
      if (!subject) {
        return res.status(404).json({ success: false, message: "Subject not found" });
      }
      subjectName = subject.title;
    }

    await video.update({
      title: title ?? video.title,
      bannerUrl: bannerUrl ?? video.bannerUrl,
      url: url ?? video.url,
      subjectId: subjectId ?? video.subjectId,
      subjectName
    });

    await video.reload();

    res.status(200).json({ success: true, message: "Video updated successfully", data: { video } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/videos/:id
export const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }
    await video.destroy();
    res.status(200).json({ success: true, message: "Video deleted successfully" });
  } catch (err) {
    next(err);
  }
};