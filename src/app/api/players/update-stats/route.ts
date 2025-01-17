import { NextRequest, NextResponse } from "next/server";
import Player from "@/models/playerModels";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { winners, losers } = body;

    // Increment wins for winners
    await Player.updateMany({ _id: { $in: winners } }, { $inc: { wins: 1 } });

    // Increment losses for losers
    await Player.updateMany({ _id: { $in: losers } }, { $inc: { losses: 1 } });

    return NextResponse.json({ message: "Player stats updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
