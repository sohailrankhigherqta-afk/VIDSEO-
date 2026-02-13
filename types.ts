
export interface SEOStrategy {
  platform: string;
  title?: string;
  captions?: string[];
  description: string;
  tags: string[];
}

export interface AnalysisResult {
  visualHook: string;
  youtube: {
    title: string;
    description: string;
    tags: string;
  };
  tiktok: {
    captions: string[];
    hashtags: string[];
  };
  facebook: {
    caption: string;
  };
  policyCheck: {
    status: 'Safe' | 'Warning' | 'Violation';
    notes: string;
  };
}
