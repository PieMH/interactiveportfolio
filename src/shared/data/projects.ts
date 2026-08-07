// Single source of truth for project structure. All display text lives in
// locales/*.json under projects.<id>.* — this file holds only structure.
// Media paths are site-absolute and case-exact (GH Pages is case-sensitive).

export type MediaItem =
  | { type: 'youtube'; id: string }
  | { type: 'image'; src: string }
  | { type: 'video'; src: string }
  | { type: 'art'; slot: string }; // per-variant SVG, resolved by the variant

export interface Project {
  id: string;
  featured?: boolean;
  card: { type: 'image'; src: string } | { type: 'art'; slot: string };
  tech: string[];
  media: MediaItem[];
}

export const projects: Project[] = [
  {
    id: 'labyrainth',
    featured: true,
    // static frame as card backdrop (perf: no multi-MB GIF above the fold); the GIF stays in the modal media
    card: { type: 'image', src: '/images/labyrainth-card.webp' },
    tech: ['Unreal Engine 5', 'C++', 'Blueprint', 'Game Design', 'VR', 'AI', 'Steam', 'Video production', 'Team management', 'Community management', 'Marketing'],
    media: [
      { type: 'youtube', id: 'XcqDjeTV7TE' },
      { type: 'youtube', id: 'yNO7C4TddEk' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/Walk1.gif' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/Run_to_Portal.gif' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/Boss.gif' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/VR.gif' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/Labyrinths.gif' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/wep_cust_syst.gif' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/mazes.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/portal.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/space.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/enemy.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/explosion.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/damage.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/weapon.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/bomb.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/whitehole.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/laser.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/die.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/powerup.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/LabyrAInth/planet.png' },
      { type: 'youtube', id: 'TF1v-1nuZSI' }
    ]
  },
  {
    id: 'metarace',
    card: { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture5.png' },
    tech: ['Unreal Engine 5', 'C++', 'OpenXR', 'OculusVR', 'WindowsMR', 'Betting games', 'Web3', 'Cryptocurrencies & NFTs'],
    media: [
      { type: 'video', src: '/Assets/PortfolioProjects/Metarace/Horses Race.mp4' },
      { type: 'video', src: '/Assets/PortfolioProjects/Metarace/Drakes Run.mp4' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture1.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture2.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture3.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture4.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture5.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture6.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture7.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture8.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture9.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture10.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture11.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture12.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metarace/Picture13.png' }
    ]
  },
  {
    id: 'metaverse',
    card: { type: 'image', src: '/Assets/PortfolioProjects/Metaverse/Screenshot.png' },
    tech: ['Unreal Engine 5', 'C++', 'VR', 'Multiplayer Networking', 'Metaverse', 'Web3', 'Chess 3D'],
    media: [
      { type: 'video', src: '/Assets/PortfolioProjects/Metaverse/mostraMetaverso.mp4' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metaverse/Screenshot.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/Metaverse/Screenshot1.png' }
    ]
  },
  {
    id: 'cas',
    card: { type: 'image', src: '/Assets/PortfolioProjects/CAS/Screenshot2.png' },
    tech: ['Java', 'AI', 'UI', 'Emergence', 'Complex Adaptive Systems', 'Data analysis', 'Genetic Algorithms'],
    media: [
      { type: 'video', src: '/Assets/PortfolioProjects/CAS/Registrazione.mp4' },
      { type: 'image', src: '/Assets/PortfolioProjects/CAS/Screenshot1.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/CAS/Screenshot2.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/CAS/Screenshot3.png' }
    ]
  },
  {
    id: 'ostomaze',
    card: { type: 'image', src: '/Assets/PortfolioProjects/OstoMaze/Picture2.png' },
    tech: ['Unity', 'C#', '2D Game Development', 'Pixelart', 'Sound Design', 'Level Design', 'Educational Games', 'Gamification'],
    media: [
      { type: 'video', src: '/Assets/PortfolioProjects/OstoMaze/Registrazione.mp4' },
      { type: 'image', src: '/Assets/PortfolioProjects/OstoMaze/logo.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/OstoMaze/Picture1.png' },
      { type: 'image', src: '/Assets/PortfolioProjects/OstoMaze/Picture2.png' }
    ]
  },
  {
    id: 'webgames',
    card: { type: 'art', slot: 'webgames' },
    tech: ['Vue.js', 'TypeScript', 'Three.js', 'Tween.js', 'PlayCanvas', 'HTML/CSS/JS'],
    media: [{ type: 'art', slot: 'webgames' }]
  },
  {
    id: 'aiagents',
    card: { type: 'art', slot: 'aiagents' },
    tech: ['n8n', 'LLMs', 'AI Agents', 'TypeScript', 'Automation'],
    media: [{ type: 'art', slot: 'aiagents' }]
  }
];

// Canonical skill levels — single source (fixes the HTML/JS mismatch bug).
export interface Skill { key: string; level: number; icon: string }
export const skills: Skill[] = [
  { key: 'gamedev', level: 90, icon: 'gamepad' },
  { key: 'ue5', level: 80, icon: 'engine' },
  { key: 'cpp', level: 70, icon: 'code' },
  { key: 'vr', level: 60, icon: 'headset' },
  { key: 'web', level: 50, icon: 'globe' },
  { key: 'android', level: 40, icon: 'phone' }
];

export const contactLinks = [
  { key: 'email', href: 'mailto:pdondiw@gmail.com', external: false, icon: 'mail' },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/pietro-dondi-53a437202/', external: true, icon: 'briefcase' },
  { key: 'github', href: 'https://github.com/PieMH', external: true, icon: 'code' },
  { key: 'resume', href: 'https://bold.pro/my/pietro-dondi-online-resume/349r', external: true, icon: 'scroll' },
  { key: 'steam', href: 'https://store.steampowered.com/app/3672600/LabyrAInth/', external: true, icon: 'gamepad' }
] as const;
