import { User } from './auth';

export interface IHeadshotStyleInfo {
  name: string;
  key: string;
  description: string;
}

export enum HeadshotStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface IHeadshot {
  _id: string;
  user: string | User;
  originalPhotoUrl: string; // S3 URL of the original uploaded photo
  originalPhotoKey: string; // S3 key for deletion
  status: HeadshotStatus;
  generatedHeadshots: Array<{
    style: string;
    url: string;
    key: string; // S3 key
    createdAt: Date;
  }>;
  selectedStyles: string[]; // Styles user selected for generation
  customPrompt?: string;
  failureReason?: string;
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHeadshotsResponse {
  headshots: IHeadshot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
