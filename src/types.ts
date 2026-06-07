export type UserRole = 'admin' | 'editor' | 'journalist' | 'contributor' | 'user';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  isPremium: boolean;
  avatarUrl: string;
  password?: string;
}

export interface WebSettings {
  websiteName: string;
  websiteLogo: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  companyName: string;
  companyAddress: string;
  companyMapCoordinates: string; // "latitude,longitude"
  socialFb: string;
  socialX: string;
  socialIg: string;
  socialYt: string;
  adsHeader: string; // Raw HTML or text/image URL for Ad
  adsSidebar: string;
  adsArticleBottom: string;
  categories: string[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  imageUrl: string;
  isPremium: boolean;
  status: 'draft' | 'scheduled' | 'published';
  publishedAt: string; // ISO string
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  views: number;
  commentsCount: number;
  encryptedHash?: string; // Visual End-to-end Article Integrity Check Signature
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  aiModerationScore?: number; // 0-100 toxicity score
  aiReason?: string;
}

export interface AuthorAnalytics {
  totalViews: number;
  viewsOverTime: { date: string; views: number }[];
  categoryPerformance: { category: string; count: number }[];
  premiumSubscriptionsReferred: number;
  ctr: number; // Click through rate
}

export interface WidgetData {
  weather: {
    temp: number;
    condition: string;
    city: string;
  };
  goldPrice: {
    perGramIDR: number;
    change: string;
  };
  kurs: {
    usdToIdr: number;
    sgdToIdr: number;
    eurToIdr: number;
  };
}
