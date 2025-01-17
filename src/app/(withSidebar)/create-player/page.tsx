"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreatePlayerPage() {
  const router = useRouter();
  const [player, setPlayer] = useState({ name: "", email: "", username: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/createplayer", player);
      toast.success("Player created successfully!");
      router.push("/playerlist");
    } catch (error) {
      toast.error("Error creating player");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl">
            {loading ? "Processing" : "Create Player"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={player.name}
                  onChange={(e) =>
                    setPlayer({ ...player, name: e.target.value })
                  }
                  placeholder="Name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={player.email}
                  onChange={(e) =>
                    setPlayer({ ...player, email: e.target.value })
                  }
                  placeholder="Email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={player.username}
                  onChange={(e) =>
                    setPlayer({ ...player, username: e.target.value })
                  }
                  placeholder="Username"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Create Player</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
