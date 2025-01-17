import { NextRequest, NextResponse } from "next/server";
import Game from "@/models/gameModel"; // Adjust with your Game model
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tournamentId: string; gameId: string } }
) {
  try {
    const { gameId } = params;
    const { status } = await request.json();

    if (!["not_started", "in_progress", "completed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value." },
        { status: 400 }
      );
    }

    // Find and update the game
    const updatedGame = await Game.findByIdAndUpdate(
      gameId,
      { status },
      { new: true }
    );

    if (!updatedGame) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Game status updated successfully",
      data: updatedGame,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
