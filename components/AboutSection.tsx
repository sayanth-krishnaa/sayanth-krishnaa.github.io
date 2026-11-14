import React from "react";
import Image from "next/image";
import { Profile, ExploreService } from "@/types/portfolio";

interface AboutSectionProps {
  profile: Profile;
  services: ExploreService[];
}

export default function AboutSection({ profile, services }: AboutSectionProps) {
  const stats = [
    { label: "Projects Completed", value: "12+" },
    { label: "Core Technologies", value: "16+" },
    { label: "Code Quality", value: "100%" },
  ];

  return (
    <section id="about" className="py-32 bg-[#090A0E] relative border-t border-white/10">
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

          <div className="tomasz-badge">ABOUT ME</div>

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

        {/* Biography Paragraph */}
        <p className="max-w-3xl mx-auto text-gray-300 text-sm sm:text-base leading-relaxed tracking-wide font-light mb-16">
          {profile.aboutFull || profile.aboutShort}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-24">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-6 bg-[#0E1017] border border-white/10 flex flex-col items-center justify-center shadow-lg"
            >
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {s.value}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] font-bold mt-2">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* EXPLORE Services */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-extrabold text-white mb-12 inline-block border-b-2 border-white pb-1.5">
            EXPLORE MY SERVICES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="relative bg-[#0E1017] border border-white/15 p-8 flex flex-col justify-between group hover:border-[#C5A880] transition-all duration-300 shadow-xl overflow-hidden"
              >
                {/* Number Watermark */}
                <span className="absolute top-4 right-4 text-4xl font-black text-white/[0.04] group-hover:text-[#C5A880]/15 transition-colors pointer-events-none">
                  0{index + 1}
                </span>

                <div>
                  {/* Service Icon */}
                  <div className="w-14 h-14 mb-8 flex items-center justify-center p-2.5 bg-white/5 border border-white/10 group-hover:border-[#C5A880] transition-colors">
                    <Image
                      src={service.icon || "/assets/template/img_533288 1.png"}
                      alt={service.title}
                      width={44}
                      height={44}
                      className="object-contain filter invert opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform"
                    />
                  </div>

                  <h4 className="text-base font-black tracking-[0.2em] text-white uppercase mb-3 pb-2 border-b border-white/15 group-hover:border-[#C5A880] transition-colors">
                    {service.title}
                  </h4>

                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
