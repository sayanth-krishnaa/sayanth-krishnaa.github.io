import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getPortfolioData, savePortfolioData } from "@/lib/db";
import {
  ProfileSchema,
  ExploreServiceSchema,
  SkillSchema,
  ProjectSchema,
} from "@/types/portfolio";
import { z } from "zod";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getPortfolioData();
  // Strip password hash from response
  const { admin, ...rest } = data;
  return NextResponse.json({
    ...rest,
    admin: { username: admin.username },
  });
}

const UpdatePayloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("profile"),
    data: ProfileSchema,
  }),
  z.object({
    type: z.literal("services"),
    data: z.array(ExploreServiceSchema),
  }),
  z.object({
    type: z.literal("skills"),
    data: z.array(SkillSchema),
  }),
  z.object({
    type: z.literal("projects"),
    data: z.array(ProjectSchema),
  }),
]);

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = UpdatePayloadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const currentData = await getPortfolioData();

    switch (parsed.data.type) {
      case "profile":
        currentData.profile = parsed.data.data;
        break;
      case "services":
        currentData.services = parsed.data.data;
        break;
      case "skills":
        currentData.skills = parsed.data.data;
        break;
      case "projects":
        currentData.projects = parsed.data.data;
        break;
    }

    await savePortfolioData(currentData);

    try {
      revalidatePath("/", "page");
      revalidatePath("/admin", "page");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      message: `${parsed.data.type} updated successfully`,
    });
  } catch (error) {
    console.error("Admin content update error:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio data" },
      { status: 500 }
    );
  }
}
