"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Tournament } from "@/types/tournament";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateTournamentPage() {
  const router = useRouter();
  const { toast } = useToast(); // Access the toast function
  const [tournament, setTournament] = useState<Tournament>({
    _id: "",
    tournamentname: "",
    playedOnDate: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tournament.tournamentname.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tournament name is required.",
      });
      return;
    }
    if (!tournament.playedOnDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid date.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/tournaments/createtournament",
        tournament
      );
      toast({
        variant: "default",
        title: "Success",
        description: "Tournament created successfully!",
      });
      router.push("/tournamentlist");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.error || "Error creating tournament.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl">
            {loading ? "Processing" : "Create Tournament"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Tournament Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={tournament.tournamentname}
                  onChange={(e) =>
                    setTournament((prev) => ({
                      ...prev,
                      tournamentname: e.target.value,
                    }))
                  }
                  placeholder="Tournament Name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="playedOnDate">Played On Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {tournament.playedOnDate ? (
                        format(tournament.playedOnDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tournament.playedOnDate}
                      onSelect={(date) => {
                        if (date) {
                          setTournament((prev) => ({
                            ...prev,
                            playedOnDate: date,
                          }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Create Tournament"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
