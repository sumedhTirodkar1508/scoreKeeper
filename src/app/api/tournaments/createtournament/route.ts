import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import Tournament from "@/models/tournamentModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { tournamentname, playedOnDate } = reqBody;

    // Validate input
    if (!tournamentname || !playedOnDate) {
      return NextResponse.json(
        { error: "Tournament name and played-on date are required." },
        { status: 400 }
      );
    }

    // Check if the tournament already exists
    const existingTournament = await Tournament.findOne({ tournamentname });
    if (existingTournament) {
      return NextResponse.json(
        { error: "Tournament with this name already exists." },
        { status: 400 }
      );
    }

    // Get the user ID from the token
    const userId = await getDataFromToken(request);

    // Create a new tournament
    const newTournament = new Tournament({
      tournamentname,
      playedOnDate,
      createdBy: userId,
    });

    const savedTournament = await newTournament.save();

    return NextResponse.json({
      message: "Tournament created successfully.",
      success: true,
      tournament: savedTournament,
    });
  } catch (error: any) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the tournament." },
      { status: 500 }
    );
  }
}
