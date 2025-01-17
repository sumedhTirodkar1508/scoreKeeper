import { NextRequest, NextResponse } from "next/server";
import Tournament from "@/models/tournamentModel"; // Import your Tournament model
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    // Fetch all tournaments from the database
    const tournaments = await Tournament.find();

    return NextResponse.json({
      message: "Tournaments found",
      data: tournaments,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
