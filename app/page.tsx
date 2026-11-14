import React from "react";
import { getPortfolioData } from "@/lib/db";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// Always fetch fresh data on request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <main className="flex-1">
      <Navbar name={data.profile.name} />
      <HeroSection profile={data.profile} />
      <AboutSection profile={data.profile} services={data.services} />
      <SkillsSection skills={data.skills} />
      <ProjectsSection projects={data.projects} />
      <ContactSection profile={data.profile} />
      <Footer profile={data.profile} />
    </main>
  );
}
