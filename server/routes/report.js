const express = require("express");
const app = express.Router();
const SalesAgent = require("../model/SalesAgent");
const SalesLead = require("../model/SalesLead");

app.get("/last-week", async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    console.log(weekAgo);

    const reports = await SalesLead.find({
      status: "Closed",
      closedAt: { $gte: weekAgo },
    })
      .populate({
        path: "salesAgent",
        select: "name",
      })
      .select("name salesAgent closedAt");
    res.json(
      reports.map((l) => ({
        id: l._id,
        name: l.name,
        salesAgent: l.salesAgent?.name || null,
        closedAt: l.closedAt,
      }))
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Server error /report/last-week",
      error: error.message,
    });
  }
});

app.get("/pipeline", async (req, res) => {
  try {
    const pipeline = await SalesLead.aggregate([
      { $match: { status: { $ne: "Closed" } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const result = pipeline.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});
    res.json({
      totalLeadsInPipeline: Object.values(result).reduce((a, b) => a + b, 0),
      byStatus: result,
    });
  } catch (error) {
    console.error("pipeline bug!", error.message);
    res.status(500).json({ success: false, error: "Server error /pipeline" });
  }
});

app.get("/closed-by-agent", async (req, res) => {
  try {
    const closed = await SalesLead.aggregate([
      { $match: { status: "Closed" } },
      { $group: { _id: "$salesAgent", count: { $sum: 1 } } },
    ]);

    const results = [];
    for (const item of closed) {
      const agent = await SalesAgent.findById(item._id).select("name");
      results.push({
        agent: agent ? agent.name : null,
        closedCount: item.count,
      });
    }
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;

/* NOTES:
   const d = new Date('2025-12-10);
   d.setDate(20) // 10 DEC TO 20DEC //2025-12-20
   d.setDate(40) // 9th Jan 2026 DES has 31 days rest 9 days ad too JAN
   NOTE: change only date 09,8 month and year adjust auto 
   d.setDate(0) // 30th Nove 2025 
*/
