import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactProps {
  email: string;
  whatsapp: string;
  behance: string;
  instagram: string;
  linkedin: string;
}

export default function Contact({
  email,
  whatsapp,
  behance,
  instagram,
  linkedin,
}: ContactProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const mailto = `mailto:${email}?subject=Project Inquiry from ${form.name}&body=Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0AProject Type: ${form.projectType}%0D%0A%0D%0A${form.message}`;
      window.location.href = mailto;
      setTimeout(() => setStatus('success'), 500);
    } catch {
      setStatus('error');
    }
  };

  const projectTypes = [
    'Brand Identity',
    'Social Media Design',
    'UI/UX Design',
    'Advertising',
    'Print Design',
    'Packaging Design',
    'Other',
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-purple-light uppercase mb-4 block">
            Contact
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-base md:text-lg text-muted max-w-xl mx-auto">
            Let's create something meaningful together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="md:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl p-6 md:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-ink-soft border border-white/[0.06] text-white text-sm focus:border-purple/50 focus:outline-none focus:ring-1 focus:ring-purple/30 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-ink-soft border border-white/[0.06] text-white text-sm focus:border-purple/50 focus:outline-none focus:ring-1 focus:ring-purple/30 transition-all"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                  Project Type
                </label>
                <select
                  required
                  value={form.projectType}
                  onChange={(e) =>
                    setForm({ ...form, projectType: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-ink-soft border border-white/[0.06] text-white text-sm focus:border-purple/50 focus:outline-none focus:ring-1 focus:ring-purple/30 transition-all"
                >
                  <option value="">Select a project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-ink-soft border border-white/[0.06] text-white text-sm focus:border-purple/50 focus:outline-none focus:ring-1 focus:ring-purple/30 transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white font-medium text-sm glow-soft hover:glow-purple transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-green-400"
                >
                  <CheckCircle2 size={18} />
                  Your email client should open with the message ready to send.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-400"
                >
                  <AlertCircle size={18} />
                  Something went wrong. Please try emailing directly.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact info & social links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-2 flex flex-col gap-4"
          >
            <a
              href={`mailto:${email}`}
              className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-purple/30 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-purple/10 flex items-center justify-center group-hover:bg-purple/20 transition-colors">
                <Mail size={20} className="text-purple-light" />
              </div>
              <div>
                <span className="block text-xs text-muted uppercase tracking-wide mb-1">
                  Email
                </span>
                <span className="text-sm text-white">{email}</span>
              </div>
            </a>

            <SocialLink
              href={whatsapp}
              label="WhatsApp"
              letter="W"
            />
            <SocialLink
              href={behance}
              label="Behance"
              letter="Be"
            />
            <SocialLink
              href={instagram}
              label="Instagram"
              letter="Ig"
            />
            <SocialLink
              href={linkedin}
              label="Facebook"
              letter="f"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  letter,
}: {
  href: string;
  label: string;
  letter: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-purple/30 transition-all group"
    >
      <div className="w-11 h-11 rounded-xl bg-purple/10 flex items-center justify-center group-hover:bg-purple/20 transition-colors">
        <span className="text-purple-light font-bold text-sm">{letter}</span>
      </div>
      <span className="text-sm text-white">{label}</span>
    </a>
  );
}
