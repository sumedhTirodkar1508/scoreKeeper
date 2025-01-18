import { NextRequest, NextResponse } from "next/server";
import Game from "@/models/gameModel"; // Adjust with your Game model
import { connect } from "@/dbConfig/dbConfig";
import mongoose from "mongoose";

connect();

export const dynamic = "force-dynamic"; // Forces the route to be dynamic and prevents caching

export async function GET(
  request: NextRequest,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const { tournamentId } = params;

    const tournamentObjectId = new mongoose.Types.ObjectId(tournamentId);

    // Fetch all games for the given tournament ID
    const games = await Game.find({ tournamentId: tournamentObjectId });
    // console.log("Fetched games:", games);

    return NextResponse.json({
      message: "Games found",
      data: games,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
