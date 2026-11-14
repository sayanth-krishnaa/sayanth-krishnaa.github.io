import { NextResponse } from "next/server";
import { addMessage } from "@/lib/db";
import { z } from "zod";

const ContactRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = ContactRequestSchema.safeParse(json);

    if (!result.success) {
      const errorMessage = result.error.errors.map(e => e.message).join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, phone, message } = result.data;
    const saved = await addMessage({ name, email, phone, message });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully! I will get back to you shortly.",
      id: saved.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
