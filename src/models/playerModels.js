import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a Player Name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  qrCodePath: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: "users",
    required: [true, "A player must have a creator."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
});

const Player =
  mongoose.models.players || mongoose.model("players", playerSchema);

export default Player;
