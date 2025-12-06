const express = require("express");
const app = express.Router();
const SalesLead = require("../model/SalesLead");
const SalesAgent = require("../model/SalesAgent");

const createNewLead = async (newLead) => {
  try {
    const lead = new SalesLead(newLead);
    const saved = await lead.save();
    return saved;
  } catch (error) {
    console.error("Sever error.`/lead`", error.message);
  }
};

app.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      payload;
    if (!name || !source || !salesAgent || !timeToClose) {
      return res.status(400).json({
        error:
          "Invalid input: name/source/salesAgent/timeToClose/ missing required fields.",
      });
    }
    const agent = await SalesAgent.findById(salesAgent);
    if (!agent)
      return res
        .status(404)
        .json({ error: `Sales agent with ID '${salesAgent} not found.'` });

    const leads = await createNewLead(payload);
    await leads.populate({ path: "salesAgent", select: "name email" });
    res.status(201).json({ success: true, data: { leads } });
  } catch (error) {
    console.error("Internal server error /lead", error);
    res.status({
      success: false,
      message: "Internal server error create lead."
    });
  }
});

const fetchedAllLeads = async () => {
  try {
    const allLeads = await SalesLead.find().populate("salesAgent");
    return allLeads;
  } catch (error) {
    console.error("server error /lead/get", error.message);
  }
};

app.get("/", async (req, res) => {
  try {
    const leads = await fetchedAllLeads();
    if (leads.length > 0) {
      res.status(200).json({ success: true, data: { leads } });
    } else {
      res.status(404).json({ success: false, message: "leads not found." });
    }
  } catch (error) {
    console.error("Internal server error `/fetch/leads`", error.message);
    res.status(500).json({
      success: false,
      message: "Internal error /get/leads",
      err: error.message,
    });
  }
});

module.exports = app;
