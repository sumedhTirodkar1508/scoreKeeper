import { NextRequest, NextResponse } from "next/server";
import Game from "@/models/gameModel"; // Adjust with your Game model
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(
  request: NextRequest,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const { tournamentId } = params;

    // Parse the request body
    const body = await request.json();
    const { teamA, teamB, status, winner } = body;

    // Validate input
    if (!teamA || !teamB || teamA.length === 0 || teamB.length === 0) {
      return NextResponse.json(
        { error: "Both teams must have players selected." },
        { status: 400 }
      );
    }

    // Create a new game
    const newGame = await Game.create({
      tournamentId,
      teamA,
      teamB,
      status: status || "not_started",
      winner: winner || null,
    });

    return NextResponse.json({
      message: "Game created successfully",
      data: newGame,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
