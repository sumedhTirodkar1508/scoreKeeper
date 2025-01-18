import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" || path === "/signup" || path === "/verifyemail";

  const token = request.cookies.get("token")?.value || "";

  // Redirect from "/" to "/leaderboard"
  if (path === "/" && token) {
    return NextResponse.redirect(new URL("/leaderboard", request.nextUrl));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/leaderboard", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signup",
    "/verifyemail",
    "/leaderboard", // Leaderboard
    "/create-player", // Player creation
    "/playerlist", // Player list
    "/create-tournament", // Tournament creation
    "/tournamentlist", // Tournament list
    "/tournaments:path*", // Matches all paths under `/tournaments` (below 4 sub paths not required to be added here)
    "/tournaments/:tournamentId/games", // Games in a specific tournament
    "/tournaments/:tournamentId/games/create-game", // Create a game in a tournament
    "/tournaments/:tournamentId/games/create-game-qr", // QR code creation for a game
    "/tournaments/:tournamentId/games/:gameId", // Specific game in a tournament
  ],
};
