import Subject from "../models/Subject.model.js";

// GET /api/subjects
export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll();
    res.set("Cache-Control", "no-store");
    res.status(200).json({ success: true, data: { subjects } });
  } catch (err) {
    next(err);
  }
};

// POST /api/subjects
export const createSubject = async (req, res, next) => {
  try {
    const { title, description, bannerUrl } = req.body;

    if (!title || !description || !bannerUrl) {
      return res.status(400).json({ success: false, message: "title, description and bannerUrl are required" });
    }

    const existing = await Subject.findOne({ where: { title } });
    if (existing) {
      return res.status(409).json({ success: false, message: "A subject with this title already exists" });
    }

    const subject = await Subject.create({ title, description, bannerUrl });

    res.status(201).json({ success: true, message: "Subject created successfully", data: { subject } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/subjects/:id
export const updateSubject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, bannerUrl } = req.body;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    if (title && title !== subject.title) {
      const existing = await Subject.findOne({ where: { title } });
      if (existing) {
        return res.status(409).json({ success: false, message: "A subject with this title already exists" });
      }
    }

    await subject.update({
      title: title ?? subject.title,
      description: description ?? subject.description,
      bannerUrl: bannerUrl ?? subject.bannerUrl,
    });

    await subject.reload();

    res.status(200).json({ success: true, message: "Subject updated successfully", data: { subject } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/subjects/:id
export const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    await subject.destroy();

    res.status(200).json({ success: true, message: "Subject deleted successfully" });
  } catch (err) {
    next(err);
  }
};