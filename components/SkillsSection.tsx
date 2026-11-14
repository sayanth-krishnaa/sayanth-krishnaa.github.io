import React from "react";
import Image from "next/image";
import { Skill } from "@/types/portfolio";

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const usingNow = skills.filter((s) => s.category === "using-now");
  const learning = skills.filter((s) => s.category === "learning");
  const other = skills.filter((s) => s.category === "other");

  return (
    <section id="skills" className="py-32 bg-[#050608] relative border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center">
        {/* Tomasz Gajda Framed Box Header */}
        <div className="flex flex-col items-center mb-16">
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

          <div className="tomasz-badge">SKILLS</div>

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

        {/* 1. USING NOW */}
        {usingNow.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-10 text-left">
              <div className="w-2 h-2 bg-[#C5A880]" />
              <h3 className="text-xs uppercase tracking-[0.3em] font-extrabold text-white">
                USING NOW:
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {usingNow.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-[#0B0D13] border border-white/10 p-7 flex flex-col items-center justify-center gap-4 group hover:border-[#C5A880]/60 hover:bg-[#121520] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1.5"
                >
                  <div className="w-16 h-16 flex items-center justify-center p-1.5">
                    <Image
                      src={skill.icon || "/assets/template/Group 12.svg"}
                      alt={skill.name}
                      width={64}
                      height={64}
                      className="object-contain max-h-14 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-300 group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. LEARNING */}
        {learning.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-3 mb-10 text-left">
              <div className="w-2 h-2 bg-[#C5A880]" />
              <h3 className="text-xs uppercase tracking-[0.3em] font-extrabold text-white">
                LEARNING:
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
              {learning.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-[#0B0D13] border border-white/10 p-7 flex flex-col items-center justify-center gap-4 group hover:border-[#C5A880]/60 hover:bg-[#121520] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1.5"
                >
                  <div className="w-16 h-16 flex items-center justify-center p-1.5">
                    <Image
                      src={skill.icon || "/assets/template/node.svg"}
                      alt={skill.name}
                      width={60}
                      height={60}
                      className="object-contain max-h-14 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-300 group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. OTHER SKILLS */}
        {other.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-10 text-left">
              <div className="w-2 h-2 bg-[#C5A880]" />
              <h3 className="text-xs uppercase tracking-[0.3em] font-extrabold text-white">
                OTHER SKILLS:
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {other.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 bg-[#0B0D13] border border-white/10 hover:border-white text-center transition-all group hover:bg-[#121520]"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300 group-hover:text-white">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
