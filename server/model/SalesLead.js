const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "lead name is required"],
  },
  source: {
    type: String,
    required: [true, "Lead source is required"],
    enum: [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ],
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesAgent", // Reference to SalesAgent module
    required: [true, "Sales Agent is required"],
  },
  status: {
    type: String,
    required: true,
    enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
    default: "New",
  },
  tags: {
    type: [String],
  },
  timeToClose: {
    type: Number,
    required: [true, "Time to Close is required"],
    min: [1, "Time to Close must be a positive numbers"], // Positive integer validation
  },
  priority: {
    type: String,
    required: true,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date, // The date when the lead was closed (optional, used when status is "Closed")
  },
});

// Middleware to update the `updatedAt` field on each save Or in other word Before a document is saved in MongoDB, this function will run automatically and update the field:So, every time you save a lead, its updatedAt field becomes the latest current date/time.
// e.g frontend type name(input f) -> between(below function run) ->Submit

leadSchema.pre("save", function () {
  this.updatedAt = Date.now();
});
// leadSchema.pre('save', function() {
//   this.name = this.name.toLowerCase();
// });
module.exports = mongoose.model("Lead", leadSchema);
