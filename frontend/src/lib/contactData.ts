import { promises as fs } from 'fs';
import path from 'path';

// Sosyal medya linki tipi
export type SocialMediaLink = {
  platform: string;
  url: string;
  ariaLabel: string;
};

// İletişim bilgileri tipleri
export type ContactInfo = {
  address: {
    title: string;
    content: string;
  };
  email: {
    title: string;
    content: string;
  };
  socialMedia: {
    title: string;
    description: string;
    links: SocialMediaLink[];
  };
};

// Sayfa içerik tipi
export type PageContent = {
  title: string;
  description: string;
};

// Harita tipi
export type MapData = {
  title: string;
  description: string;
  embedUrl: string;
};

// Ana contact data tipi
export type ContactData = {
  pageContent: PageContent;
  contactInfo: ContactInfo;
  map: MapData;
};

// Server-side function to get contact page data
export async function getContactData(): Promise<ContactData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'contact', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return data;
  } catch (error) {
    console.error('Error fetching contact data:', error);
    throw new Error('Contact data could not be loaded');
  }
}
