"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Tournament } from "@/types/tournament";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function TournamentListPage() {
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch tournaments on page load
  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/tournaments/getalltournaments");
      setTournaments(response.data.data);
    } catch (error) {
      console.error("Error fetching tournaments", error);
      toast({
        title: "Error",
        description: "Failed to fetch tournaments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  // Navigate to the games page for a specific tournament
  const handleGamesClick = (tournamentId: string) => {
    router.push(`/tournaments/${tournamentId}/games`);
  };

  return (
    <div className="flex flex-col justify-start min-h-screen py-2">
      <h1 className="text-xl font-bold mb-4">Tournament List</h1>
      {loading ? (
        <p>Loading tournaments...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tournament Name</TableHead>
              <TableHead>Played On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.length > 0 ? (
              tournaments.map((tournament) => (
                <TableRow key={tournament._id}>
                  <TableCell>{tournament.tournamentname}</TableCell>
                  <TableCell>
                    {new Date(tournament.playedOnDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleGamesClick(tournament._id)}
                    >
                      Games
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No tournaments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
