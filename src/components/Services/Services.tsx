import React from 'react';
import { Layers, Layout, Server, Database, Smartphone, Cloud, ArrowUpRight } from 'lucide-react';
import { Service } from '../../types';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';

interface ServicesProps {
  services: Service[];
}

export const Services: React.FC<ServicesProps> = ({ services }) => {
  return (
    <section id="services" className="py-20 lg:py-28 border-b border-[#02F74C]/20 bg-[#020203] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#02F74C]/20 pb-5 mb-12">
          <div>
            <div className="text-xs text-[#02F74C] font-semibold mb-1 flex items-center gap-2">
              <span>/06</span>
              <span>•</span>
              <CodeTag tag="WHAT I BUILD />" />
            </div>
            <h2 className="font-code-header text-3xl sm:text-5xl text-[#F3F3F4] uppercase font-bold tracking-tight">
              SYSTEM_CAPABILITIES
            </h2>
          </div>
          <div className="text-xs text-[#76A988]">
            // END_TO_END_DEVELOPMENT
          </div>
        </div>

        {/* Technical Service Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className="border border-[#02F74C]/25 bg-[#0A0D0C] p-6 hover:border-[#02F74C] hover:shadow-[0_0_20px_rgba(2,247,76,0.15)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#02F74C]/15 pb-3 mb-4 text-xs">
                  <span className="text-[#02F74C] font-bold group-hover:glow-neon">
                    &lt;MODULE_{service.service_number} /&gt;
                  </span>
                  <span className="text-[10px] text-[#76A988]">ENGINEERING</span>
                </div>

                <h3 className="font-code-header text-lg font-bold uppercase text-[#F3F3F4] group-hover:text-[#02F74C] transition-colors mb-3">
                  {service.title}
                </h3>

                <p className="text-xs text-[#A6A9AA] leading-relaxed mb-6">
                  &gt; {service.description}
                </p>

                {service.features && service.features.length > 0 && (
                  <ul className="space-y-1.5 border-t border-[#02F74C]/10 pt-4 mb-4 text-xs text-[#76A988]">
                    {service.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[#02F74C]">+</span>
                        <span className="text-[#F3F3F4]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-3 border-t border-[#02F74C]/15 flex items-center justify-between text-[11px] text-[#76A988]">
                <span>DELIVERY: PRODUCTION</span>
                <span className="text-[#02F74C] group-hover:translate-x-1 transition-transform">
                  &gt;&gt;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Section Code Footer */}
        <div className="text-xs text-[#76A988] mt-6 select-none">
          <CodeClosingTag tag="WHAT I BUILD" />
        </div>
      </div>
    </section>
  );
};
