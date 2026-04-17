export const STANDARD_CATEGORIES: Record<string, string[]> = {
  Development: ['development', 'web', 'python', 'system', 'programming'],
  'CTF/Wargame': ['ctf/wargame', 'ctf-wargame', 'ctf', 'pwn', 'web', 'reverse', 'crypto', 'wargame'],
  BugBounty: ['bugbounty', 'bug bounty', 'security', 'research', 'vulnerability'],
  'Technical Document': ['technical document', 'technicaldocument', 'document', 'guide', 'tutorial'],
  'Paper/Conference': ['paper/conference', 'paper-conference', 'paper', 'conference', 'academic', 'publication'],
  'Contest/Certification': ['contest/certification', 'contest-certification', 'contest', 'certification', 'award'],
};

export const CATEGORY_ICONS: Record<string, string> = {
  Development: '💻',
  'CTF/Wargame': '🏁',
  BugBounty: '🛡️',
  'Technical Document': '📄',
  'Paper/Conference': '📚',
  'Contest/Certification': '🏆',
  Etc: '⚓',
};

export const CATEGORY_ORDER = [
  'Development',
  'CTF/Wargame',
  'BugBounty',
  'Technical Document',
  'Paper/Conference',
  'Contest/Certification',
  'Etc',
] as const;

export type StandardCategory = (typeof CATEGORY_ORDER)[number];

export const CAREER_ITEMS = [
  {
    title: 'Undergraduate Research Intern',
    org: 'Confidential',
    period: '2026.01 - 2026.02',
    description: 'Winter internship focused on security research and AI guardrails.',
  },
  {
    title: 'BoB (Best of the Best) Graduate',
    org: 'KITRI',
    period: '2025.06 - 2025.12',
    description: 'Completed the 14th Best of the Best program while focusing on security research and building.',
  },
  {
    title: 'Information Security Engineering',
    org: 'Sangmyung University',
    period: '2021 - Present',
    description: 'Pursuing a degree centered on practical security engineering and AI-oriented defense.',
  },
] as const;

export const PROJECT_ITEMS = [
  {
    title: 'SLM-based OT Solution',
    description: 'Applied security architecture for OT environments with an SLM-centered defensive workflow.',
  },
  {
    title: 'SyzDirect',
    description: 'Directed greybox fuzzing work focused on Linux kernel efficiency and path discovery.',
  },
  {
    title: 'Honeypot',
    description: 'Deception-oriented telemetry and attacker behavior analysis for threat intelligence.',
  },
] as const;
