import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiGlobe, FiMail } from 'react-icons/fi';
import Logo from './Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FiGithub, url: 'https://github.com', label: 'GitHub' },
    { icon: FiLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FiTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: FiGlobe, url: 'https://freshhire.dev', label: 'Website' },
  ];

  const productLinks = [
    { to: '/dsa', label: 'DSA Preparation' },
    { to: '/resume-scan', label: 'ATS Scanner' },
    { to: '/aptitude', label: 'Aptitude' },
  ];

  const resourceLinks = [
    { to: '/experiences', label: 'Interview Experience' },
    { to: '/login', label: 'Get Started' },
    { to: '/#features', label: 'Features' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative mt-8 w-full border-t border-[var(--border)] bg-[var(--surface)]"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-full max-w-[1400px] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 pr-4">
              <Logo className="!m-0" />
              <span className="font-bold" style={{ fontFamily: 'var(--heading-font)' }}>
                Fresh<span className="text-[var(--primary)]">Hire</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
              AI-powered placement prep — resume scoring, DSA roadmaps, aptitude packs, and verified interview experiences.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-1 lg:col-span-5 lg:grid-cols-2">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Product</h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--primary)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Resources</h4>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--primary)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">Contact</h4>
            <a
              href="mailto:support@freshhire.dev"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
            >
              <FiMail className="h-4 w-4 shrink-0 text-[var(--primary)]" />
              support@freshhire.dev
            </a>
            <p className="mt-4 text-xs leading-relaxed text-[var(--muted-foreground)]">
              Available for placement-season support and product feedback.
            </p>
            <Link to="/login" className="btn-primary mt-5 inline-flex w-full justify-center py-2.5 text-sm sm:w-auto">
              Start Free
            </Link>
          </div>
        </div>

        <div className="my-8 h-px w-full bg-[var(--border)]" />

        <div className="flex flex-col items-center justify-between gap-6 text-center text-xs text-[var(--muted-foreground)] sm:flex-row sm:text-left">
          <div className="flex flex-col gap-1.5">
            <span>© {currentYear} FreshHire. All rights reserved.</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="flex h-5 items-center rounded bg-[var(--primary)]/10 px-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">Built by</span>
              Dev Core
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-2 sm:items-end sm:gap-1.5">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[var(--muted-foreground)]">Idea Exhibited & Core Dev</span>
              <span className="font-bold text-[var(--foreground)]">Mallampati Sumanth</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[var(--muted-foreground)]">Developer In All</span>
              <span className="font-bold text-[var(--foreground)]">Dinesh Karthik</span>
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
