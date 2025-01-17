import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import Player from "@/models/playerModels";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, email, username } = reqBody;
    const qrData = `${name}, ${email}, ${username}`; // Customize QR data as needed

    //check if Player already exists
    const player = await Player.findOne({ username });

    if (player) {
      return NextResponse.json(
        { error: "Player already exists" },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrCodePath = path.join(
      process.cwd(),
      "public",
      "qrcodes",
      `${username}.png`
    );
    await QRCode.toFile(qrCodePath, qrData);

    const userId = await getDataFromToken(request);

    // Save player data and QR code path to MongoDB
    const newPlayer = new Player({
      name,
      email,
      username,
      qrCodePath: `/qrcodes/${username}.png`,
      createdBy: userId,
    });

    const savedPlayer = await newPlayer.save();
    console.log("Saved Player:", savedPlayer);

    return NextResponse.json({
      message: "Player and QR created successfully",
      success: true,
      savedPlayer,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
