export interface Section {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  date: string;
  user_id: string;
  updated_at: string;
}

export interface AnalysisCache {
  [key: string]: string;
}