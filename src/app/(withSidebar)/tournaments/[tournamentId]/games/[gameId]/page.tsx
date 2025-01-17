"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@/types/game";

export default function GameDetailsPage({
  params,
}: {
  params: { gameId: string; tournamentId: string };
}) {
  const { gameId, tournamentId } = params;
  const { toast } = useToast();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch the game details
  const fetchGameDetails = async () => {
    try {
      const response = await axios.get(
        `/api/tournaments/${tournamentId}/games/${gameId}`
      );
      setGame(response.data.data);
    } catch (error) {
      console.error("Error fetching game details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch game details.",
      });
    }
  };

  useEffect(() => {
    fetchGameDetails();
  }, []);

  // Update game status
  const handleStatusChange = async (
    status: "not_started" | "in_progress" | "completed"
  ) => {
    if (!game) return;

    try {
      setLoading(true);
      await axios.patch(
        `/api/tournaments/${tournamentId}/games/${gameId}/update-game-status`,
        {
          status,
        }
      );
      toast({
        title: "Success",
        description: "Game status updated successfully!",
      });
      setGame({ ...game, status });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.error || "Failed to update game status.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle team win
  const handleTeamWin = async (winner: "teamA" | "teamB") => {
    if (!game) return;

    const winningTeam = winner === "teamA" ? game.teamA : game.teamB;
    const losingTeam = winner === "teamA" ? game.teamB : game.teamA;

    try {
      setLoading(true);
      await axios.post(
        `/api/tournaments/${tournamentId}/games/${gameId}/declare-winner`,
        {
          winner,
        }
      );

      // Update wins and losses for the players
      await axios.patch(`/api/players/update-stats`, {
        winners: winningTeam,
        losers: losingTeam,
      });

      toast({
        title: "Success",
        description: `Winner declared: ${winner}`,
      });

      router.push(`/tournaments/${tournamentId}/games`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to declare winner.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-4">
      <div className="w-full max-w-4xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl mb-4 text-center">
              Game Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Status Dropdown */}
            <div className="mb-6">
              <Label htmlFor="status">Game Status</Label>
              <Select
                value={game.status}
                onValueChange={(value) =>
                  handleStatusChange(
                    value as "not_started" | "in_progress" | "completed"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Players and Team Win Buttons */}
            <div className="grid grid-cols-2 gap-6">
              {/* Team A */}
              <div className="border p-4 rounded shadow">
                <Button
                  onClick={() => handleTeamWin("teamA")}
                  disabled={loading || game.status === "completed"}
                  className="w-full mb-4"
                >
                  Team A Wins
                </Button>
                <h2 className="text-lg font-semibold mb-2">Team A Players</h2>
                <ul className="space-y-2">
                  {game.teamA.map((player) => (
                    <li key={player._id} className="text-gray-700">
                      {player.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Team B */}
              <div className="border p-4 rounded shadow">
                <Button
                  onClick={() => handleTeamWin("teamB")}
                  disabled={loading || game.status === "completed"}
                  className="w-full mb-4"
                >
                  Team B Wins
                </Button>
                <h2 className="text-lg font-semibold mb-2">Team B Players</h2>
                <ul className="space-y-2">
                  {game.teamB.map((player) => (
                    <li key={player._id} className="text-gray-700">
                      {player.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
