import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/db";
import { createSession, verifyAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const data = await getPortfolioData();
    const isUserValid = (username === data.admin.username || username === "admin");
    const isPasswordValid = await verifyAdminCredentials(password);

    if (!isUserValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await createSession(data.admin.username);

    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
