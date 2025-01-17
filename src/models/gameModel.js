import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tournaments",
    required: [true, "A game must have a tournament."],
  },
  teamA: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "players",
    },
  ],
  teamB: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "players",
    },
  ],
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed"],
    default: "not_started",
  },
  winner: { type: String, enum: ["teamA", "teamB", null], default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Game = mongoose.models.games || mongoose.model("games", gameSchema);

export default Game;
