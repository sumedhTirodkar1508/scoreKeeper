import axios from "axios";
import { Player } from "@/types/player";

export const getPlayerDetails = async (): Promise<Player[]> => {
  try {
    const res = await axios.get("/api/players/getplayers", {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    return res.data.data; // Return the fetched data
  } catch (error: any) {
    console.error("Error getting all players details:", error.message);
    throw error; // Throw the error to let the caller handle it
  }
};
