
import { useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Send, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  FaBehance,
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
} from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });

  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');

  const projectTypes = [
    { value: 'Brand Identity', ar: 'تصميم الهوية البصرية' },
    { value: 'Social Media Design', ar: 'تصميم السوشيال ميديا' },
    { value: 'UI/UX Design', ar: 'تصميم واجهات وتجربة المستخدم' },
    { value: 'Advertising', ar: 'الإعلانات' },
    { value: 'Print Design', ar: 'التصميمات المطبوعة' },
    { value: 'Packaging Design', ar: 'تصميم العبوات والتغليف' },
    { value: 'Other', ar: 'أخرى' },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS environment variables are missing.');
      setStatus('error');
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          reply_to: form.email,
          project_type: form.projectType,
          message: form.message,
        },
        publicKey
      );

      setStatus('success');

      setForm({
        name: '',
        email: '',
        projectType: '',
        message: '',
      });
    } catch (error) {
      console.error('EmailJS sending error:', error);
      setStatus('error');
    }
  };

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
            {t('contactLabel')}
          </span>

          <h2 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight mb-4">
            {t('contactHeading')}
          </h2>

          <p className="text-base md:text-lg text-muted max-w-xl mx-auto">
            {t('contactDescription')}
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
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-ink-soft border border-white/[0.06] text-white text-sm focus:border-purple/50 focus:outline-none focus:ring-1 focus:ring-purple/30 transition-all"
                    placeholder={t('yourName')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                    {t('email')}
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
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                  {t('projectType')}
                </label>

                <select
                  required
                  value={form.projectType}
                  onChange={(e) =>
                    setForm({ ...form, projectType: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-ink-soft border border-white/[0.06] text-white text-sm focus:border-purple/50 focus:outline-none focus:ring-1 focus:ring-purple/30 transition-all"
                >
                  <option value="">{t('selectProjectType')}</option>

                  {projectTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {isArabic ? type.ar : type.value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                  {t('message')}
                </label>

                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-ink-soft border border-white/[0.06] text-white text-sm focus:border-purple/50 focus:outline-none focus:ring-1 focus:ring-purple/30 transition-all resize-none"
                  placeholder={t('messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white font-medium text-sm glow-soft hover:glow-purple transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  t('sending')
                ) : (
                  <>
                    {t('sendMessage')}
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
                  {t('messageSuccess')}
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-400"
                >
                  <AlertCircle size={18} />
                  {t('messageError')}
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
                  {t('email')}
                </span>
                <span className="text-sm text-white" dir="ltr">
                  {email}
                </span>
              </div>
            </a>

            <SocialLink
              href={whatsapp}
              label="WhatsApp"
              icon={<FaWhatsapp size={22} />}
            />

            <SocialLink
              href={behance}
              label="Behance"
              icon={<FaBehance size={22} />}
            />

            <SocialLink
              href={instagram}
              label="Instagram"
              icon={<FaInstagram size={22} />}
            />

            <SocialLink
              href={linkedin}
              label="Facebook"
              icon={<FaFacebookF size={20} />}
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
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-purple/30 transition-all group"
    >
      <div className="w-11 h-11 rounded-xl bg-purple/10 flex items-center justify-center group-hover:bg-purple/20 transition-colors text-purple-light">
        {icon}
      </div>

      <span className="text-sm text-white">{label}</span>
    </a>
  );
}
