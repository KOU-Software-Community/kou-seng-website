import { faGithub, faInstagram, faLinkedin, faTiktok } from '@fortawesome/free-brands-svg-icons';

export interface FooterData {
  clubInfo: {
    name: string;
    description: string;
  };
  quickLinks: Array<{
    title: string;
    href: string;
  }>;
  contactInfo: {
    address: {
      university: string;
      faculty: string;
      location: string;
    };
    email: string;
  };
  socialMedia: Array<{
    name: string;
    href: string;
    icon: string;
    ariaLabel: string;
  }>;
  copyright: {
    text: string;
  };
}

// Icon mapping for FontAwesome icons
export const iconMap = {
  faGithub,
  faTiktok,
  faInstagram,
  faLinkedin,
} as const;

export const getFooterData = async (): Promise<FooterData> => {
  try {
    const response = await fetch('/data/footer/data.json');
    if (!response.ok) {
      throw new Error('Footer verileri yüklenemedi');
    }
    return await response.json();
  } catch (error) {
    console.error('Footer verileri yüklenirken hata:', error);
    throw new Error('Footer verileri yüklenemedi');
  }
};
