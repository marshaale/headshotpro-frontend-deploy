import { api } from '../api';
import {
  IHeadshot,
  IHeadshotsResponse,
  IHeadshotStyleInfo,
} from '../types/headshot';

export const headshotService = {
  getAvailableStyles: async (): Promise<IHeadshotStyleInfo[]> => {
    return api.get<IHeadshotStyleInfo[]>('/headshots/styles');
  },
  generateHeadshots: async (formData: FormData): Promise<IHeadshot> => {
    return api.post('/headshots/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getHeadshots: async (
    limit: number = 10,
    offset: number = 0,
  ): Promise<IHeadshotsResponse> => {
    return api.get<IHeadshotsResponse>(
      `/headshots?limit=${limit}&offset=${offset}`,
    );
  },
  getHeadshotById: async (id: string): Promise<IHeadshot> => {
    return api.get<IHeadshot>(`/headshots/${id}`);
  },
  deleteHeadshot: async (id: string): Promise<void> => {
    return api.delete(`/headshots/${id}`);
  },
  downloadHeadshot: async (url: string): Promise<void> => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
