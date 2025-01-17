import { connect } from "@/dbConfig/dbConfig";
import Player from "@/models/playerModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PATCH(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, name, wins, losses } = reqBody;

    console.log(reqBody);

    //check if user already exists
    const player = await Player.findOne({ username });

    if (!player) {
      return NextResponse.json(
        { error: "Player doesn't exist" },
        { status: 400 }
      );
    }

    const newPlayer = new Player({
      username,
      email,
      name,
      wins,
      losses,
    });

    // Update the player details
    const updatedPlayer = await Player.findOneAndUpdate(
      { username }, // Find player by username
      { $set: { email, name, wins, losses } }, // Update email and name
      { new: true } // Return the updated document
    );
    if (!updatedPlayer) {
      return NextResponse.json(
        { error: "Failed to update player" },
        { status: 500 }
      );
    }

    console.log(updatedPlayer);

    return NextResponse.json({
      message: "Player uodated successfully",
      success: true,
      updatedPlayer,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
