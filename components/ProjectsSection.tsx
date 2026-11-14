"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Project } from "@/types/portfolio";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<"all" | "coded" | "designed">("all");

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.category === filter;
  });

  return (
    <section id="portfolio" className="py-32 bg-[#090A0E] relative border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center">
        {/* Tomasz Gajda Framed Box Header */}
        <div className="flex flex-col items-center mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-16 sm:w-28 bg-white/20" />
            <div className="w-5 h-5 flex items-center justify-center">
              <Image
                src="/assets/template/ic_baseline-double-arrow.svg"
                alt="separator"
                width={16}
                height={16}
                className="opacity-70 rotate-180"
              />
            </div>
            <div className="h-[2px] w-16 sm:w-28 bg-white/20" />
          </div>

          <div className="tomasz-badge">PORTFOLIO</div>

          <div className="flex items-center gap-4 mt-4">
            <div className="h-[2px] w-16 sm:w-28 bg-white/20" />
            <div className="w-5 h-5 flex items-center justify-center">
              <Image
                src="/assets/template/ic_baseline-double-arrow.svg"
                alt="separator"
                width={16}
                height={16}
                className="opacity-70"
              />
            </div>
            <div className="h-[2px] w-16 sm:w-28 bg-white/20" />
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex justify-center items-center gap-6 sm:gap-12 mb-16">
          {(["all", "coded", "designed"] as const).map((tab) => {
            const count =
              tab === "all"
                ? projects.length
                : projects.filter((p) => p.category === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-xs uppercase tracking-[0.25em] font-black pb-2 transition-all relative flex items-center gap-2 ${
                  filter === tab
                    ? "text-white border-b-2 border-[#C5A880]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <span>{tab}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/10 text-gray-300 rounded-sm">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#0E1017] border border-white/15 overflow-hidden group hover:border-[#C5A880] transition-all duration-300 shadow-2xl flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full bg-[#050608] overflow-hidden">
                <Image
                  src={project.image || "/assets/template/image 17.svg"}
                  alt={project.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-110"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-transparent to-transparent opacity-60" />

                <span className="absolute top-4 right-4 px-3 py-1 bg-[#050608]/90 text-[10px] font-black tracking-widest uppercase text-[#C5A880] border border-white/20 backdrop-blur-md">
                  {project.category}
                </span>
              </div>

              {/* Details */}
              <div className="p-8 space-y-4">
                <h3 className="text-lg font-black text-white uppercase tracking-wider group-hover:text-[#C5A880] transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#050608] text-gray-300 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-all inline-flex items-center gap-2 shadow-md"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 border border-white/30 text-white font-extrabold text-xs uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all inline-flex items-center gap-2 ml-auto"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <FolderGit2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-xs uppercase tracking-widest">No projects in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
