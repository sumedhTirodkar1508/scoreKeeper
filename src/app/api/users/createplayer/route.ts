import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connect } from "@/dbConfig/dbConfig";
import Player from "@/models/playerModel";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
// import fs from "fs";
// import path from "path";
import cloudinary from "@/utils/cloudinary";

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

    // const qrCodePath = path.join(
    //   process.cwd(),
    //   "public",
    //   "qrcodes",
    //   `${username}.png`
    // );
    // await QRCode.toFile(qrCodePath, qrData);

    // Generate QR code as a Base64 string
    const qrBase64 = await QRCode.toDataURL(qrData);

    // Upload QR code to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(qrBase64, {
      folder: "qrcodes", // Optional: Organize files into a folder in Cloudinary
      public_id: username, // Save with a specific public ID
      resource_type: "image",
    });

    // Get user ID from token
    const userId = await getDataFromToken(request);

    // Save player data and QR code path to MongoDB
    const newPlayer = new Player({
      name,
      email,
      username,
      // qrCodePath: `/qrcodes/${username}.png`,
      qrCodePath: cloudinaryResponse.secure_url, // Save the Cloudinary URL
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
