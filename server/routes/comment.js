const express = require("express");
const app = express.Router();
const Comment = require("../model/Comment");
const SalesLead = require("../model/SalesLead");
const SalesAgent = require("../model/SalesAgent");

const addComment = async (c) => {
  try {
    const comment = new Comment(c);
    const saved = await comment.save();
    return saved;
  } catch (error) {
    console.error("Internal error:", error.message);
  }
};

app.post("/:id/comments", async (req, res) => {
  try {
    const payload = req.body;
    const leadId = req.params.id;
    const { commentText, author } = payload;
    if (!commentText || !author)
      return res.status(400).json({ error: "Missing required fields" });

    const lead = await SalesLead.findById(leadId);
    if (!lead)
      return res
        .status(400)
        .json({ success: false, error: `Lead with Id '${leadId}' not found.` });

    const agent = await SalesAgent.findById(author);

    if (!agent)
      return res
        .status(404)
        .json({ error: `Lead with ID '${author}' not found. ` });

    const comment = await addComment({ lead: leadId, author, commentText });
    await comment.populate({ path: "author", select: "name email" });
    res.status(201).json({ success: true, data: { comment } });
  } catch (error) {
    console.error("Server error /adding comment", error.message);
    res.status(500).json({
      success: false,
      message: "Server error /comment",
      error: error.message,
    });
  }
});

const getComments = async (search) => {
  try {
    const comments = await Comment.find(search).populate({
      path: "author",
      select: "name email",
    }).sort({createdAt: -1});
    return comments;
  } catch (error) {
    console.error("Internal error /get/comment", error.message);
  }
};

app.get("/:id/comments", async (req, res) => {
  try {
    const leadId = req.params.id;
    const lead = await SalesLead.findById(leadId);
    if (!lead)
      return res
        .status(404)
        .json({ error: `Lead with ID '${leadId}' not found.` });
    const comments = await getComments({ lead: leadId });
    if (comments.length > 0) {
      res.status(200).json({ success: true, data: { comments } });
    } else {
      res.status(404).json({ success: false, message: "Comment not found." });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: error.message });
  }
});

// UPDATE COMMENT
app.put("/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentText } = req.body;

    if (!commentText) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.commentText = commentText;
    await comment.save();

    await comment.populate({
      path: "author",
      select: "name email",
    });

    res.status(200).json({
      success: true,
      data: { comment },
    });
  } catch (error) {
    console.error("Error updating comment:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating comment",
      error: error.message,
    });
  }
});


module.exports = app;
