import axios from "axios";
import { toast } from "react-hot-toast";
import { Player } from "@/types/player";

export const getPlayerDetails = async (): Promise<Player[]> => {
  try {
    const res = await axios.get("/api/players/getplayers");
    toast.success("Players fetched successfully!");
    return res.data.data;
  } catch (error: any) {
    console.error("Error getting all players details:", error.message);
    toast.error(error.message);
    throw error; // Allow the calling component to handle errors if needed
  }
};
