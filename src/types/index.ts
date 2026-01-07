// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  subscriptionStatus: 'free' | 'active' | 'cancelled';
  subscriptionId?: string;
  subscriptionEndDate?: Date;
  dailyAnalysesUsed: number;
  dailyResetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Analysis types
export interface AnalysisRequest {
  image: File | Blob;
  userId: string;
}

export interface AnalysisResponse {
  id: string;
  responses: {
    witty: string[];
    romantic: string[];
    savage: string[];
  };
  contextSummary: string;
  createdAt: Date;
}

export interface AnalysisHistory {
  id: string;
  userId: string;
  responses: {
    witty: string[];
    romantic: string[];
    savage: string[];
  };
  contextSummary: string;
  createdAt: Date;
}

// Subscription types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'week' | 'month';
  stripePriceId: string;
}

export type Persona = 'witty' | 'romantic' | 'savage';

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface UsageInfo {
  dailyAnalysesUsed: number;
  dailyLimit: number;
  isSubscribed: boolean;
  remainingAnalyses: number;
}
