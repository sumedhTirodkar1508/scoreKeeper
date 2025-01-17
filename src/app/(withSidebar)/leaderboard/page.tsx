"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getPlayerDetails } from "@/helpers/getPlayerDetails";
import { Player } from "@/types/player";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  // Function to fetch players (can be reused for initial load and manual updates)
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const playerData = await getPlayerDetails();
      setPlayers(playerData);
    } catch (error) {
      console.error("Error fetching players", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch players on page load
  useEffect(() => {
    fetchPlayers();
  }, []);

  // Sort players according to the defined logic
  const sortedPlayers = [...players].sort((a, b) => {
    // Compare by number of wins (descending)
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    // If wins are equal, compare by number of losses (ascending)
    if (a.losses !== b.losses) {
      return a.losses - b.losses;
    }

    // If wins and losses are equal, compare lexicographically by username (ascending)
    return a.username.localeCompare(b.username);
  });

  return (
    <div className="flex flex-col justify-start min-h-screen py-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Leaderboard</h1>
        <Button onClick={fetchPlayers} disabled={loading}>
          {loading ? "Updating..." : "Refresh"}
        </Button>
      </div>
      {loading ? (
        <p>Loading players...</p>
      ) : (
        <Table>
          <TableCaption>Find who&apos;s leading</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>Losses</TableHead>
              {/* <TableHead className="text-right">Amount</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.length > 0 ? (
              sortedPlayers.map((player) => (
                <TableRow key={player._id}>
                  <TableCell>{player.username}</TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.wins}</TableCell>
                  <TableCell>{player.losses}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No players found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      )}
    </div>
  );
}
