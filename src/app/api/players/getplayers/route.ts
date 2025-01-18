import { NextRequest, NextResponse } from "next/server";
import Player from "@/models/playerModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export const dynamic = "force-dynamic"; // Forces the route to be dynamic and prevents caching

export async function GET(request: NextRequest) {
  try {
    // const userId = await getDataFromToken(request);
    const players = await Player.find();
    return NextResponse.json({
      mesaaage: "Players found",
      data: players,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
