import { Player } from "./player";

export interface Game {
  _id: string;
  tournamentId: string;
  teamA: Player[];
  teamB: Player[];
  status: "not_started" | "in_progress" | "completed";
  winner: "teamA" | "teamB" | null;
}
