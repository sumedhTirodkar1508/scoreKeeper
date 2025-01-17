import { connect } from "@/dbConfig/dbConfig";
import Player from "@/models/playerModels";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function DELETE(request: NextRequest) {
  try {
    // Extract the username from the request body
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Username is required for deletion" },
        { status: 400 }
      );
    }

    // Check if the player exists
    const player = await Player.findOne({ _id: userId });

    if (!player) {
      return NextResponse.json(
        { error: "Player doesn't exist" },
        { status: 404 }
      );
    }

    // Delete the player
    await Player.deleteOne({ _id: userId });

    return NextResponse.json({
      message: "Player deleted successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
