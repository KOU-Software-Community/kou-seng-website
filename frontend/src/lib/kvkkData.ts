import { promises as fs } from 'fs';
import path from 'path';

// Bölüm: başlık, listeden önceki paragraflar, madde listesi, listeden sonraki paragraflar
export type KvkkSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  after?: string[];
};

export type KvkkData = {
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: KvkkSection[];
};

// Server-side function to get KVKK page data
export async function getKvkkData(): Promise<KvkkData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'kvkk', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error fetching KVKK data:', error);
    throw new Error('KVKK data could not be loaded');
  }
}
