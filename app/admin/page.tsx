import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPortfolioData, getMessages } from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [data, messages] = await Promise.all([
    getPortfolioData(),
    getMessages(),
  ]);

  return <AdminDashboard initialData={data} initialMessages={messages} />;
}
