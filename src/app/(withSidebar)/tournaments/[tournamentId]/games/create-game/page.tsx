"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Player } from "@/types/player";
import { Game } from "@/types/game";

export default function CreateGamePage({
  params,
}: {
  params: { tournamentId: string };
}) {
  const { tournamentId } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch players
  const fetchPlayers = async () => {
    try {
      const response = await axios.get("/api/players/getplayers");
      setPlayers(response.data.data); // Assuming API returns a list of players
    } catch (error) {
      console.error("Error fetching players", error);
      toast({
        title: "Error",
        description: "Failed to fetch players.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Handle team selections
  const handleTeamSelect = (player: Player, team: "A" | "B") => {
    if (team === "A") {
      setTeamA((prev) => {
        const updated = prev.some((p) => p._id === player._id)
          ? prev.filter((p) => p._id !== player._id)
          : [player, ...prev];
        return updated;
      });
      setTeamB((prev) => prev.filter((p) => p._id !== player._id));
    } else {
      setTeamB((prev) => {
        const updated = prev.some((p) => p._id === player._id)
          ? prev.filter((p) => p._id !== player._id)
          : [player, ...prev];
        return updated;
      });
      setTeamA((prev) => prev.filter((p) => p._id !== player._id));
    }
  };

  const finalizeTeams = async () => {
    if (teamA.length === 0 || teamB.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Both teams must have players selected.",
      });
      return;
    }

    try {
      setLoading(true);
      const newGame: Game = {
        tournamentId,
        teamA: teamA,
        teamB: teamB,
        status: "not_started",
        winner: null,
        _id: "",
      };
      const response = await axios.post(
        `/api/tournaments/${tournamentId}/games/creategame`,
        newGame
      );
      toast({
        variant: "default",
        title: "Success",
        description: "Game created successfully!",
      });
      router.push(
        `/tournaments/${tournamentId}/games/${response.data.data._id}`
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Error creating the game.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-row py-4 gap-8">
        {/* Team A Section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">Team A</h2>
          {players.map((player) => (
            <div key={player._id} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={teamA.some((p) => p._id === player._id)}
                onChange={() => handleTeamSelect(player, "A")}
                disabled={teamB.some((p) => p._id === player._id)} // Disable if selected in Team B
              />
              <span
                className={`${
                  teamA.some((p) => p._id === player._id) ? "font-bold" : ""
                } ${
                  teamB.some((p) => p._id === player._id) ? "line-through" : ""
                }`}
              >
                {player.username}
              </span>
            </div>
          ))}
        </div>

        {/* Team B Section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">Team B</h2>
          {players.map((player) => (
            <div key={player._id} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={teamB.some((p) => p._id === player._id)}
                onChange={() => handleTeamSelect(player, "B")}
                disabled={teamA.some((p) => p._id === player._id)} // Disable if selected in Team A
              />
              <span
                className={`${
                  teamB.some((p) => p._id === player._id) ? "font-bold" : ""
                } ${
                  teamA.some((p) => p._id === player._id) ? "line-through" : ""
                }`}
              >
                {player.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Finalize Button */}
      <div className="flex flex-col justify-center">
        <Button
          onClick={finalizeTeams}
          disabled={loading}
          className="mt-4 w-full"
        >
          {loading ? "Finalizing..." : "Finalize Teams"}
        </Button>
      </div>
    </div>
  );
}
