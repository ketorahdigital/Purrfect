export enum Tab {
  DASHBOARD = 'DASHBOARD',
  COMPETITORS = 'COMPETITORS',
  STORE_PREVIEW = 'STORE_PREVIEW',
  GURU_CHAT = 'GURU_CHAT'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'toy' | 'furniture' | 'food' | 'accessory';
  image: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  price: string;
  icon: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface AnalysisResult {
  content: string;
  sources: Array<{
    uri: string;
    title: string;
  }>;
}