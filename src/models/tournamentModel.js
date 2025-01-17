import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  tournamentname: {
    type: String,
    required: [true, "Please provide a tournament name"],
    unique: true,
  },
  playedOnDate: {
    type: Date,
    required: [true, "Please provide a tournament Played On Date"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: "users",
    required: [true, "A tournament must have a creator."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tournament =
  mongoose.models.tournaments ||
  mongoose.model("tournaments", tournamentSchema);

export default Tournament;
