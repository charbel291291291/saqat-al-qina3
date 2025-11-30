import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserCases = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-cases', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          case_evidence (
            id,
            file_url,
            file_type,
            thumbnail_url
          ),
          comments (
            id,
            comment_text,
            is_approved,
            created_at
          ),
          case_timeline_events (
            id,
            event_type,
            event_description,
            created_at
          )
        `)
        .eq('submitted_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};
