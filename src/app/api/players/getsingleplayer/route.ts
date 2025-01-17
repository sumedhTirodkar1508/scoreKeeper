import { NextRequest, NextResponse } from "next/server";
import Player from "@/models/playerModels";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    // Extract the username from the query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    console.log("username: ", username);
    // Check if username is provided
    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    // Find the player by username
    const player = await Player.findOne({ username });

    // Handle if the player is not found
    if (!player) {
      return NextResponse.json({ error: "Player not found." }, { status: 404 });
    }

    // Return the player details
    return NextResponse.json({
      message: "Player found",
      player,
    });
  } catch (error: any) {
    // Handle errors and return appropriate response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
