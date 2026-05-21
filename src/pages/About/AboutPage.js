// AboutPage.js
import React from 'react';
import './AboutPage.css';
import codeVid from '../../assets/videos/code.mp4';

const skillGroups = [
  {
    title: 'Languages',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" height="3rem" width="3rem">
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M4 16h16V5H4v11zm9 2v2h4v2H7v-2h4v-2H2.992A.998.998 0 012 16.993V4.007C2 3.451 2.455 3 2.992 3h18.016c.548 0 .992.449.992 1.007v12.986c0 .556-.455 1.007-.992 1.007H13z" />
      </svg>
    ),
    items: ['Python', 'TypeScript', 'JavaScript', 'Rust', 'SQL', 'Bash', 'HTML', 'CSS'],
  },
  {
    title: 'Frameworks',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" height="3rem" width="3rem">
        <path d="M13.785 11.245 A1.785 1.785 0 0 1 12 13.03 A1.785 1.785 0 0 1 10.215 11.245 A1.785 1.785 0 0 1 13.785 11.245 z" />
        <path d="M7.002 14.794l-.395-.101c-2.934-.741-4.617-2.001-4.617-3.452 0-1.452 1.684-2.711 4.617-3.452l.395-.1.111.391a19.507 19.507 0 001.136 2.983l.085.178-.085.178c-.46.963-.841 1.961-1.136 2.985l-.111.39zm-.577-6.095c-2.229.628-3.598 1.586-3.598 2.542 0 .954 1.368 1.913 3.598 2.54.273-.868.603-1.717.985-2.54a20.356 20.356 0 01-.985-2.542zm10.572 6.095l-.11-.392a19.628 19.628 0 00-1.137-2.984l-.085-.177.085-.179c.46-.961.839-1.96 1.137-2.984l.11-.39.395.1c2.935.741 4.617 2 4.617 3.453 0 1.452-1.683 2.711-4.617 3.452l-.395.101zm-.41-3.553c.4.866.733 1.718.987 2.54 2.23-.627 3.599-1.586 3.599-2.54 0-.956-1.368-1.913-3.599-2.542a20.683 20.683 0 01-.987 2.542z" />
        <path d="M6.419 8.695l-.11-.39c-.826-2.908-.576-4.991.687-5.717 1.235-.715 3.222.13 5.303 2.265l.284.292-.284.291a19.718 19.718 0 00-2.02 2.474l-.113.162-.196.016a19.646 19.646 0 00-3.157.509l-.394.098zm1.582-5.529c-.224 0-.422.049-.589.145-.828.477-.974 2.138-.404 4.38.891-.197 1.79-.338 2.696-.417a21.058 21.058 0 011.713-2.123c-1.303-1.267-2.533-1.985-3.416-1.985zm7.997 16.984c-1.188 0-2.714-.896-4.298-2.522l-.283-.291.283-.29a19.827 19.827 0 002.021-2.477l.112-.16.194-.019a19.473 19.473 0 003.158-.507l.395-.1.111.391c.822 2.906.573 4.992-.688 5.718a1.978 1.978 0 01-1.005.257zm-3.415-2.82c1.302 1.267 2.533 1.986 3.415 1.986.225 0 .423-.05.589-.145.829-.478.976-2.142.404-4.384-.89.198-1.79.34-2.698.419a20.526 20.526 0 01-1.71 2.124z" />
        <path d="M17.58 8.695l-.395-.099a19.477 19.477 0 00-3.158-.509l-.194-.017-.112-.162A19.551 19.551 0 0011.7 5.434l-.283-.291.283-.29c2.08-2.134 4.066-2.979 5.303-2.265 1.262.727 1.513 2.81.688 5.717l-.111.39zm-3.287-1.421c.954.085 1.858.228 2.698.417.571-2.242.425-3.903-.404-4.381-.824-.477-2.375.253-4.004 1.841.616.67 1.188 1.378 1.71 2.123zM8.001 20.15a1.983 1.983 0 01-1.005-.257c-1.263-.726-1.513-2.811-.688-5.718l.108-.391.395.1c.964.243 2.026.414 3.158.507l.194.019.113.16c.604.878 1.28 1.707 2.02 2.477l.284.29-.284.291c-1.583 1.627-3.109 2.522-4.295 2.522zm-.993-5.362c-.57 2.242-.424 3.906.404 4.384.825.47 2.371-.255 4.005-1.842a21.17 21.17 0 01-1.713-2.123 20.692 20.692 0 01-2.696-.419z" />
      </svg>
    ),
    items: ['React', 'Next.js', 'Vue', 'Nuxt', 'React Native', 'Expo', 'Node.js', 'Express', 'Nest.js', 'Flask', 'Tauri', 'Tailwind CSS'],
  },
  {
    title: 'Infrastructure',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" height="3rem" width="3rem">
        <path d="M21 11h-3V8a1 1 0 0 0-1-1h-4V4h-2v3H7a1 1 0 0 0-1 1v3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1zM8 9h8v2H8V9zm12 10h-2v-5h-2v5h-2v-5h-2v5h-2v-5H8v5H6v-5H4v5H4z" />
      </svg>
    ),
    items: ['AWS', 'GCP', 'Docker', 'Terraform', 'Cloudflare', 'Vercel', 'Fly.io', 'GitHub Actions', 'Sentry'],
  },
  {
    title: 'Databases',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" height="3rem" width="3rem">
        <path d="M12 2C7.58 2 4 3.79 4 6v12c0 2.21 3.59 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm0 16c-3.87 0-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V18c0 .5-2.13 2-6 2zm0-4c-3.87 0-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V12c0 .5-2.13 2-6 2zm0-4c-3.87 0-6-1.5-6-2V7.77c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V10c0 .5-2.13 2-6 2z" />
      </svg>
    ),
    items: ['Postgres', 'MySQL', 'SQLite', 'Firebase', 'OpenSearch', 'Memgraph'],
  },
  {
    title: 'Tools',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" height="3rem" width="3rem">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
    items: ['Git', 'Jira', 'Stripe', 'Datadog', 'PostHog', 'Claude Code', 'Cursor', 'MCP', 'Whisper', 'Ollama', 'Apple HealthKit'],
  },
];

const AboutPage = () => {
  return (
    <div name="about" className="about">
      <div className="about-overlay"></div>
      <video
        src={codeVid}
        autoPlay="autoplay"
        playsInLine="playsinline"
        loop="true"
        muted="true"
      ></video>
      <div className="about-container">
        <div className="top">
          <h1>Skills</h1>
        </div>
        <div className="about-card-container">
          {skillGroups.map((group) => (
            <div className="about-card" key={group.title}>
              <div className="card-title">
                <div className="icon-container">{group.icon}</div>
                <div className="title-text">
                  <h2>{group.title}</h2>
                </div>
              </div>
              <div className="skill-chips">
                {group.items.map((item) => (
                  <span className="skill-chip" key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
