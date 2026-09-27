import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { headshotService } from '../services/headshot.service';
import { HeadshotStatus } from '../types/headshot';

export function useGetAvailableStyles() {
  return useQuery({
    queryKey: ['headshot-styles'],
    queryFn: () => headshotService.getAvailableStyles(),
    retry: 2,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useGenerateHeadshots() {
  return useMutation({
    mutationFn: (formData: FormData) =>
      headshotService.generateHeadshots(formData),
  });
}

export function useGetHeadshots(limit: number = 10, offset: number = 0) {
  return useQuery({
    queryKey: ['headshots'],
    queryFn: () => headshotService.getHeadshots(limit, offset),
    refetchInterval(query) {
      const data = query.state.data;
      const hasProcessingHeadshot = data?.headshots.some(
        (d) => d.status === HeadshotStatus.PROCESSING,
      );
      return hasProcessingHeadshot ? 5000 : false;
    },
  });
}

export function useGetHeadshotById(id: string | null) {
  return useQuery({
    queryKey: ['headshot', id],
    queryFn: () => headshotService.getHeadshotById(id as string),
    enabled: !!id,
  });
}

export function useDeleteHeadshot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => headshotService.deleteHeadshot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headshots'] });
    },
  });
}
