"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Player } from "@/types/player";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, UserPlus, Loader2 } from "lucide-react";

export default function CreateGameQRPage({
  params,
}: {
  params: { tournamentId: string };
}) {
  const { tournamentId } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);
  const [scanningTeam, setScanningTeam] = useState<"A" | "B" | null>(null);
  const [loading, setLoading] = useState(false);

  const teamARef = useRef<string[]>([]);
  const teamBRef = useRef<string[]>([]);

  const extractUsername = (input: string): string => {
    const parts = input.split(",");
    const username = parts[parts.length - 1].trim();
    return username;
  };

  const fetchPlayerDetails = async (input: string): Promise<Player | null> => {
    try {
      const username = extractUsername(input);
      const response = await axios.get(`/api/players/getsingleplayer`, {
        params: { username },
      });

      if (response.status === 200 && response.data.player) {
        return response.data.player;
      } else {
        console.error(
          "Error fetching player details:",
          response.data.error || "Unknown error"
        );
        return null;
      }
    } catch (error: any) {
      console.error("Error fetching player details:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to fetch player details.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleScan = async (result: string | null) => {
    if (!result) return;

    try {
      const player = await fetchPlayerDetails(result);

      if (!player) {
        toast({
          title: "Error",
          description: "Player not found.",
          variant: "destructive",
        });
        return;
      }

      const username = player.username;
      if (
        teamARef.current.includes(username) ||
        teamBRef.current.includes(username)
      ) {
        toast({
          title: "Error",
          description: `Player ${username} is already in a team.`,
          variant: "destructive",
        });
        return;
      }

      if (scanningTeam === "A") {
        teamARef.current.push(username);
        setTeamA((prev) => [...prev, player]);
        toast({
          title: "Success",
          description: `Player ${username} added to Team A.`,
        });
      } else if (scanningTeam === "B") {
        teamBRef.current.push(username);
        setTeamB((prev) => [...prev, player]);
        toast({
          title: "Success",
          description: `Player ${username} added to Team B.`,
        });
      }
    } catch (error) {
      console.error("Error handling scan:", error);
      toast({
        title: "Error",
        description: "Failed to add player.",
        variant: "destructive",
      });
    }
  };

  const removePlayer = (
    player: Player,
    team: "A" | "B",
    setTeam: React.Dispatch<React.SetStateAction<Player[]>>,
    teamRef: React.MutableRefObject<string[]>
  ) => {
    setTeam((prev) => {
      const updatedTeam = prev.filter((p) => p.username !== player.username);
      teamRef.current = teamRef.current.filter(
        (username) => username !== player.username
      );
      return updatedTeam;
    });

    toast({
      title: "Success",
      description: `Player ${player.username} removed from Team ${team}.`,
    });
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
      const newGame = {
        tournamentId,
        teamA,
        teamB,
        status: "not_started",
        winner: null,
      };
      const response = await fetch(
        `/api/tournaments/${tournamentId}/games/creategame`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newGame),
        }
      );
      const data = await response.json();
      toast({
        variant: "default",
        title: "Success",
        description: "Game created successfully!",
      });
      router.push(`/tournaments/${tournamentId}/games/${data.data._id}`);
    } catch (error) {
      console.error("Error creating game:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error creating the game.",
      });
    } finally {
      setLoading(false);
    }
  };

  const TeamCard = ({
    team,
    setTeam,
    teamRef,
  }: {
    team: "A" | "B";
    setTeam: React.Dispatch<React.SetStateAction<Player[]>>;
    teamRef: React.MutableRefObject<string[]>;
  }) => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Team {team}
          <Badge variant="secondary">
            {team === "A" ? teamA.length : teamB.length} Players
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => setScanningTeam(scanningTeam === team ? null : team)}
          disabled={scanningTeam !== null && scanningTeam !== team}
          className="w-full mb-4"
        >
          {scanningTeam === team ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Stop Scanning
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Players
            </>
          )}
        </Button>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {(team === "A" ? teamA : teamB).map((player, index) => (
            <React.Fragment key={player.username}>
              {index > 0 && <Separator className="my-2" />}
              <div className="flex justify-between items-center">
                <span>{player.username}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePlayer(player, team, setTeam, teamRef)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </React.Fragment>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Create Game with QR Scanner
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <TeamCard team="A" setTeam={setTeamA} teamRef={teamARef} />
        <TeamCard team="B" setTeam={setTeamB} teamRef={teamBRef} />
      </div>

      {scanningTeam && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Scanning for Team {scanningTeam}</CardTitle>
          </CardHeader>
          <CardContent>
            <BarcodeScannerComponent
              width="100%"
              height={400}
              onUpdate={(err, result) => {
                if (result) handleScan(result.getText());
              }}
            />
          </CardContent>
        </Card>
      )}

      <Button
        onClick={finalizeTeams}
        disabled={
          loading ||
          scanningTeam !== null ||
          teamA.length === 0 ||
          teamB.length === 0
        }
        className="w-full max-w-sm mx-auto block"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Finalizing...
          </>
        ) : (
          "Finalize Teams"
        )}
      </Button>
    </div>
  );
}
