import { promises as fs } from 'fs';
import path from 'path';

// Team member type
export type TeamMember = {
  name: string;
  role: string;
  image: string;
  department: string;
  github: string;
  kaggle: string;
  linkedin: string;
  skills: string[];
};

// Team leader message type
export type LeaderMessage = {
  title: string;
  content: string;
  author: string;
  role: string;
};

// Achievement type
export type Achievement = {
  title: string;
  event: string;
  date: string;
  description: string;
};

// Competition type
export type Competition = {
  name: string;
  date: string;
  result: string;
  description: string;
};

// Project type
export type Project = {
  title: string;
  description: string;
  technologies: string[];
  status: string;
  github: string;
  demo: string | null;
};

// Team detail type
export type TeamDetail = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  leaderMessage: LeaderMessage;
  members: TeamMember[];
  achievements: Achievement[];
  competitions: Competition[];
  projects: Project[];
};

// Server-side function to fetch team data
export async function getTeamDetail(slug: string): Promise<TeamDetail | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'teams', `${slug}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const teamData = JSON.parse(fileContents);
    
    return {
      ...teamData,
      slug
    };
  } catch (error) {
    console.error('Error fetching team data:', error);
    return null;
  }
}

// Get all available team slugs
export async function getTeamSlugs(): Promise<string[]> {
  try {
    const teamsDir = path.join(process.cwd(), 'public', 'data', 'teams');
    const files = await fs.readdir(teamsDir);
    
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error fetching team slugs:', error);
    return [];
  }
}
