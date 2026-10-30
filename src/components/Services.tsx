import { motion } from 'framer-motion';
import {
  Palette,
  Share2,
  Layout,
  Megaphone,
  Printer,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import type { Service } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Share2,
  Layout,
  Megaphone,
  Printer,
  Compass,
};

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-purple-light uppercase mb-4 block">
            Services
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight">
            How I Can Help You
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon ?? 'Palette'] ?? Palette;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative p-7 rounded-2xl glass-card hover:border-purple/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Glow on hover */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple/20 to-purple/5 flex items-center justify-center mb-6 group-hover:from-purple/30 transition-all group-hover:scale-110">
                    <Icon size={26} className="text-purple-light" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
