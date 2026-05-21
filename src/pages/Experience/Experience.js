import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Experience.css';

const experiences = [
  {
    role: 'Software Developer I',
    company: 'Duplex',
    org: 'Redbrick Media',
    location: 'Victoria, BC',
    period: 'Jan 2025 — Present',
    highlights: [
      'Drove the DynamoDB → Postgres + OpenSearch migration across the core API in Python and Flask, retiring a legacy search and precomputed-feed stack.',
      'Architected an internal MCP server exposing a cross-repo knowledge graph over six private repos (Memgraph + OpenAI embeddings) — 15× token reduction, 5.5× faster than grep-and-read.',
      "Led the company-wide AI Working Group — MCP servers, Claude Code, Cursor, and authoring Claude Skills.",
    ],
    tech: ['Python', 'Flask', 'Postgres', 'OpenSearch', 'AWS', 'Terraform', 'TypeScript'],
  },
  {
    role: 'Software Engineer',
    company: 'Dopa',
    org: 'Part-Time',
    location: 'Remote',
    period: 'Apr 2025 — Present',
    highlights: [
      'Architected an iOS health-verification subsystem: Postgres with row-level security, a Deno edge function with per-user rate limiting, and a HealthKit abstraction gating daily check-ins.',
      'Built the analytics + feature-flag system on PostHog with identify-on-signin, anonymous-to-identified merging, and a typed feature-flag registry.',
    ],
    tech: ['React Native', 'Expo', 'Supabase', 'Postgres', 'Deno', 'PostHog', 'HealthKit'],
  },
  {
    role: 'Full-Stack Developer Co-op',
    company: 'Shift',
    org: 'Redbrick Media',
    location: 'Victoria, BC',
    period: 'Apr 2024 — Dec 2024',
    highlights: [
      "Owned migration of Chromium's built-in pages (bookmarks, history, settings, downloads) onto the product's design system via a CSS injection layer.",
      "Built bidirectional sync between Chromium's native bookmarks engine and a MobX state store, plus the custom keyboard-shortcut system on Chromium's commands API.",
    ],
    tech: ['React', 'MobX', 'Chromium', 'TypeScript'],
  },
  {
    role: 'Technical Team Analyst',
    company: 'Toonie Holding',
    org: '',
    location: 'Remote',
    period: 'Apr 2023 — Sep 2023',
    highlights: [
      'Designed the technical architecture for a cryptocurrency-exchange web app: end-to-end requirements (SRS, wireframes, data models) for the Agile team.',
      'Built the Nest.js backend foundation from scratch and delivered REST APIs for an NFT marketplace and crypto-wallet flows.',
    ],
    tech: ['Nest.js', 'Node.js', 'TypeScript'],
  },
  {
    role: 'QA Specialist Co-op',
    company: 'Shift',
    org: 'Redbrick Media',
    location: 'Victoria, BC',
    period: 'Sep 2021 — Jul 2022',
    highlights: [
      'Built an end-to-end Puppeteer test suite for a Chromium-based desktop browser — 120+ test cases across navigation, bookmarks, settings, and account flows.',
      'Led cross-platform release testing (Apple Silicon, Mac Intel, Windows); closed front-end React bugs surfaced by automation and earned a Full-Stack co-op return offer.',
    ],
    tech: ['Puppeteer', 'JavaScript', 'React'],
  },
];

const ExperienceCard = ({ exp, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <motion.div
      ref={ref}
      className="exp-row"
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="exp-spine">
        <span className="exp-node" />
      </div>
      <article className="exp-card">
        <header className="exp-card-head">
          <div className="exp-role-line">
            <h3 className="exp-role">{exp.role}</h3>
            <span className="exp-period">{exp.period}</span>
          </div>
          <div className="exp-meta-line">
            <span className="exp-company">{exp.company}</span>
            {exp.org && <span className="exp-org">· {exp.org}</span>}
            {exp.location && <span className="exp-loc">· {exp.location}</span>}
          </div>
        </header>
        <ul className="exp-highlights">
          {exp.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
        <div className="exp-tech">
          {exp.tech.map((t) => (
            <span key={t} className="exp-chip">{t}</span>
          ))}
        </div>
      </article>
    </motion.div>
  );
};

const Experience = () => {
  return (
    <section name="experience" id="experience" className="experience">
      <div className="experience-inner">
        <header className="experience-head">
          <h1>Experience</h1>
          <p className="experience-sub">A timeline of where I&apos;ve built, broken, and shipped things.</p>
        </header>
        <div className="exp-timeline">
          {experiences.map((exp, i) => (
            <ExperienceCard key={`${exp.company}-${exp.period}`} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
