import { NextRequest, NextResponse } from "next/server";
import Game from "@/models/gameModel"; // Adjust with your Game model
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { gameId } = params;

    const game = await Game.findById(gameId)
      .populate("teamA")
      .populate("teamB");

    if (!game) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Game found",
      data: game,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
