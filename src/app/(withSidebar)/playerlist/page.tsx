"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getPlayerDetails } from "@/helpers/getPlayerDetails";
import { Player } from "@/types/player";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PlayerListPage() {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    wins: 0,
    losses: 0,
  });
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);

  // Fetch players on page load
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

  useEffect(() => {
    fetchPlayers();
  }, []);

  const { toast } = useToast(); // Access the toast function

  // Handle edit button click
  const handleEditClick = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      username: player.username,
      email: player.email,
      name: player.name,
      wins: player.wins,
      losses: player.losses,
    });
  };

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (editingPlayer) {
      try {
        // Replace this with an actual API call to update the player details
        const response = await axios.patch(
          "/api/players/updateplayer",
          formData
        );
        console.log("Player update success", response.data);
        const updatedPlayers = players.map((player) =>
          player._id === editingPlayer._id
            ? { ...editingPlayer, ...formData }
            : player
        );
        setPlayers(updatedPlayers);
        setEditingPlayer(null);
        // Show success toast
        toast({
          title: "Player updated",
          description: "The player details were updated successfully.",
        });
      } catch (error: any) {
        console.error("Error updating player", error);

        // Show error toast
        toast({
          title: "Error updating player",
          description: error.response?.data?.error || "Something went wrong!",
          variant: "destructive", // Makes the toast red for errors
        });
      }
    } else {
      // Show error toast if no player is being edited
      toast({
        title: "No player selected",
        description: "Please select a player to edit.",
        variant: "destructive",
      });
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (deletingPlayerId) {
      try {
        // Make API call to delete the player
        const response = await axios.delete(
          `/api/players/deleteplayer?userId=${deletingPlayerId}`
        );
        console.log("Player deleted successfully", response.data);

        // Update the players state to remove the deleted player
        const updatedPlayers = players.filter(
          (player) => player._id !== deletingPlayerId
        );
        setPlayers(updatedPlayers);
        setDeletingPlayerId(null);

        // Show success toast
        toast({
          title: "Player deleted",
          description: "The player was deleted successfully.",
        });
      } catch (error: any) {
        console.error("Error deleting player", error);

        // Show error toast
        toast({
          title: "Error deleting player",
          description: error.response?.data?.error || "Something went wrong!",
          variant: "destructive", // Makes the toast red for errors
        });
      }
    } else {
      // Show error toast if no player is selected for deletion
      toast({
        title: "No player selected",
        description: "Please select a player to delete.",
        variant: "destructive",
      });
    }
  };

  // Handle delete button click
  const handleDeleteClick = (playerId: string) => {
    setDeletingPlayerId(playerId);
  };

  return (
    <div className="flex flex-col justify-start min-h-screen py-2">
      <h1 className="text-xl font-bold mb-4">Player List</h1>
      {loading ? (
        <p>Loading players...</p>
      ) : (
        <Table>
          <TableCaption>List of all the players registered.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>Losses</TableHead>
              <TableHead>Actions</TableHead>
              {/* <TableHead className="text-right">Amount</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.length > 0 ? (
              players.map((player) => (
                <TableRow key={player._id}>
                  <TableCell>{player.username}</TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.wins}</TableCell>
                  <TableCell>{player.losses}</TableCell>
                  <TableCell>
                    {/* Edit Dialog */}
                    <Dialog
                      open={editingPlayer?._id === player._id}
                      onOpenChange={(open) => !open && setEditingPlayer(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(player)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Player</DialogTitle>
                          <DialogDescription>
                            Make changes to the player information. Click save
                            when done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Username
                            </Label>
                            <Input
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              className="col-span-3"
                              disabled
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="wins" className="text-right">
                              Wins
                            </Label>
                            <Input
                              id="wins"
                              name="wins"
                              value={formData.wins}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="losses" className="text-right">
                              Losses
                            </Label>
                            <Input
                              id="losses"
                              name="losses"
                              value={formData.losses}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPlayer(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleSaveChanges}
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {/* Delete Confirmation Dialog */}
                    <Dialog
                      open={deletingPlayerId === player._id}
                      onOpenChange={(open) =>
                        !open && setDeletingPlayerId(null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(player._id)}
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this player? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingPlayerId(null)}
                          >
                            No
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteConfirm}
                          >
                            Yes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No players found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
