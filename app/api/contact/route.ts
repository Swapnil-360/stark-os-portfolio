import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required transmission parameters." },
        { status: 400 }
      );
    }

    console.log("Transmission received:", { name, email, subject, message, date: new Date().toISOString() });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("messages").insert([
          {
            name,
            email,
            subject: subject || "Portfolio Inbound",
            message,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (dbErr) {
        console.warn("Could not persist message to Supabase:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Transmission successfully recorded.",
    });
  } catch (error) {
    console.error("Transmission route error:", error);
    return NextResponse.json(
      { error: "Internal dispatch failure." },
      { status: 500 }
    );
  }
}
