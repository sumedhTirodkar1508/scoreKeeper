"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    // Validate fields before making the API call
    if (!user.email || !user.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email and Password cannot be empty!",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      if (!response.data.isVerified) {
        toast({
          variant: "destructive",
          title: "Account not verified",
          description: "Please verify your email before logging in.",
        });
        return;
      }
      toast({
        title: "Login successful",
        description: "Login successful!",
      });
      router.push("/leaderboard");
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Avatar className="h-25 w-25">
              <AvatarImage src="../../crosspointx.svg" alt="Logo" />
              <AvatarFallback>X</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl text-center">
            {loading ? "Processing" : "Login"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                  id="email"
                  type="text"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder="password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className="w-full bg-[#2970a8] text-white rounded-full py-3 hover:bg-[#6388bb] transition-colors animate-none hover:animate-bounceHover"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            variant="link"
            asChild
            className="text-blue-500 hover:underline mt-5"
          >
            <Link href="/signup">Don&apos;t have an account? Sign up here</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
