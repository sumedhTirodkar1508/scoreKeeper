"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Game } from "@/types/game";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function GameListPage({
  params,
}: {
  params: { tournamentId: string };
}) {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<Game[]>([]); // Replace `any` with your Game interface if defined
  const { toast } = useToast();
  const router = useRouter();
  const { tournamentId } = params;

  // Fetch games for the specific tournament
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/tournaments/${tournamentId}/games`
      );
      setGames(response.data.data); // Assuming the API returns games in `data`
    } catch (error) {
      console.error("Error fetching games", error);
      toast({
        title: "Error",
        description: "Failed to fetch games.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [tournamentId]);

  return (
    <div className="flex flex-col justify-start min-h-screen">
      <div className="mb-6 justify-between flex">
        <div>
          <Button
            variant="ghost"
            className="px-6 py-3 space-x-2 rounded-full flex items-center"
            onClick={() => router.push(`/tournamentlist`)}
          >
            <ArrowLeft className=" h-4 w-4" />
            Back to Tournaments
          </Button>
        </div>
        <div className="flex space-x-4">
          <Button
            className="bg-green-600 text-white rounded-full px-6 py-3 hover:bg-green-700 active:bg-green-800 transition-all flex items-center space-x-2"
            variant="secondary"
            onClick={() =>
              router.push(`/tournaments/${tournamentId}/games/create-game-qr`)
            }
          >
            <Plus className="h-5 w-5" />
            Create New Game with QR
          </Button>
          <Button
            className="bg-green-600 text-white rounded-full px-6 py-3 hover:bg-green-700 active:bg-green-800 transition-all flex items-center space-x-2"
            variant="secondary"
            onClick={() =>
              router.push(`/tournaments/${tournamentId}/games/create-game`)
            }
          >
            <Plus className="h-5 w-5" />
            Create New Game
          </Button>
        </div>
      </div>
      <Card className="w-full">
        <CardHeader className="pt-4 pb-0">
          <CardTitle className="text-xl font-bold">
            Games for Tournament: {tournamentId}
          </CardTitle>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent>
          {loading ? (
            <p>Loading games...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game ID</TableHead>
                  {/* <TableHead>Team A</TableHead> */}
                  {/* <TableHead>Team B</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Winner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.length > 0 ? (
                  games.map((game) => (
                    <TableRow key={game._id}>
                      <TableCell>
                        <Link
                          href={`/tournaments/${tournamentId}/games/${game._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {game._id}
                        </Link>
                      </TableCell>
                      {/* <TableCell>{game.teamA}</TableCell> */}
                      {/* <TableCell>{game.teamB}</TableCell> */}
                      <TableCell>{game.status}</TableCell>
                      <TableCell>{game.winner || "Pending"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No games found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
