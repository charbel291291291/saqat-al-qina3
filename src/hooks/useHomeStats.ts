import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CaseStats {
  total: number;
  published: number;
  pending: number;
  resolved: number;
  ignored: number;
}

export interface LatestCase {
  id: string;
  title: string;
  short_description: string;
  category: string;
  region: string;
  created_at: string;
}

export interface TopOfficial {
  id: string;
  name: string;
  position: string;
  overall_score: number;
  institution_name?: string;
  image_url?: string;
}

export const useHomeStats = () => {
  return useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      // Fetch case statistics
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('status');

      if (casesError) throw casesError;

      const stats: CaseStats = {
        total: cases?.length || 0,
        published: cases?.filter(c => c.status === 'published').length || 0,
        pending: cases?.filter(c => c.status === 'pending_review').length || 0,
        resolved: cases?.filter(c => c.status === 'resolved').length || 0,
        ignored: cases?.filter(c => c.status === 'ignored').length || 0,
      };

      // Fetch latest published cases
      const { data: latestCases, error: latestError } = await supabase
        .from('cases')
        .select('id, title, short_description, category, region, created_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(4);

      if (latestError) throw latestError;

      // Fetch top officials (highest scores)
      const { data: topOfficials, error: topError } = await supabase
        .from('officials')
        .select(`
          id,
          name,
          position,
          overall_score,
          image_url,
          institutions (name)
        `)
        .order('overall_score', { ascending: false })
        .limit(3);

      if (topError) throw topError;

      // Fetch worst officials (lowest scores)
      const { data: worstOfficials, error: worstError } = await supabase
        .from('officials')
        .select(`
          id,
          name,
          position,
          overall_score,
          image_url,
          institutions (name)
        `)
        .order('overall_score', { ascending: true })
        .limit(3);

      if (worstError) throw worstError;

      return {
        stats,
        latestCases: latestCases as LatestCase[],
        topOfficials: (topOfficials || []).map(o => ({
          ...o,
          institution_name: (o.institutions as any)?.name,
        })) as TopOfficial[],
        worstOfficials: (worstOfficials || []).map(o => ({
          ...o,
          institution_name: (o.institutions as any)?.name,
        })) as TopOfficial[],
      };
    },
  });
};
