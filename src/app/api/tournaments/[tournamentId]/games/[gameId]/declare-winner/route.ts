import { NextRequest, NextResponse } from "next/server";
import Game from "@/models/gameModel"; // Adjust with your Game model
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { gameId } = params;
    const body = await request.json();
    const { winner } = body;

    if (!["teamA", "teamB"].includes(winner)) {
      return NextResponse.json(
        { error: "Invalid winner specified." },
        { status: 400 }
      );
    }

    const game = await Game.findByIdAndUpdate(
      gameId,
      { winner, status: "completed" },
      { new: true }
    );

    if (!game) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Winner declared successfully",
      data: game,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
