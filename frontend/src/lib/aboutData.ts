import { promises as fs } from 'fs';
import path from 'path';
import { faLaptopCode, faRobot, faGamepad } from '@fortawesome/free-solid-svg-icons';

// Yönetim Kurulu üye tipi
export type BoardMember = {
  name: string;
  role: string;
  image: string;
  department: string;
  github: string;
  linkedin: string;
};

// Zaman çizelgesi etkinlik tipi
export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

// Çalışma alanı tipi
export type FocusArea = {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // FontAwesome icon
};

// Sayfa içerik tipi
export type PageContent = {
  missionVision: {
    title: string;
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
  };
  boardMembers: {
    title: string;
    description: string;
  };
  timeline: {
    title: string;
    description: string;
  };
  focusAreas: {
    title: string;
    description: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    href: string;
  };
};

// About data tipi
export type AboutData = {
  pageContent: PageContent;
  boardMembers: BoardMember[];
  timelineEvents: TimelineEvent[];
  focusAreas: FocusArea[];
};

// Icon mapping
const iconMap: Record<string, typeof faLaptopCode> = {
  faLaptopCode,
  faRobot,
  faGamepad
};

// Server-side function to get about page data
export async function getAboutData(): Promise<AboutData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'about', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Map icon strings to actual FontAwesome icons
    const focusAreasWithIcons = data.focusAreas.map((area: { title: string; description: string; icon: string }) => ({
      ...area,
      icon: iconMap[area.icon] || faLaptopCode
    }));
    
    return {
      ...data,
      focusAreas: focusAreasWithIcons
    };
  } catch (error) {
    console.error('Error fetching about data:', error);
    throw new Error('About data could not be loaded');
  }
}
