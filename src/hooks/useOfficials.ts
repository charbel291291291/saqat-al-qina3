import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Official {
  id: string;
  name: string;
  position: string;
  region: 'beirut' | 'mount_lebanon' | 'north' | 'south' | 'bekaa' | 'nabatieh';
  institution_id: string | null;
  image_url: string | null;
  overall_score: number | null;
  response_speed_score: number | null;
  execution_score: number | null;
  followup_score: number | null;
  respect_score: number | null;
  created_at: string;
  updated_at: string;
  institutions?: {
    id: string;
    name: string;
    type: string;
  };
}

export const useOfficials = () => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('officials')
        .select(`
          *,
          institutions:institution_id(id, name, type)
        `)
        .order('name');

      if (error) throw error;
      setOfficials(data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل المسؤولين',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addOfficial = async (official: Omit<Official, 'id' | 'created_at' | 'updated_at' | 'institutions'>) => {
    try {
      const { error } = await supabase
        .from('officials')
        .insert([official]);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم إضافة المسؤول بنجاح',
      });

      fetchOfficials();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateOfficial = async (id: string, updates: Partial<Official>) => {
    try {
      const { error } = await supabase
        .from('officials')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم تحديث المسؤول بنجاح',
      });

      fetchOfficials();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteOfficial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('officials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم حذف المسؤول بنجاح',
      });

      fetchOfficials();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const assignOfficialToCase = async (caseId: string, officialId: string) => {
    try {
      const { error } = await supabase
        .from('case_officials')
        .insert({
          case_id: caseId,
          official_id: officialId,
        });

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم ربط المسؤول بالقضية بنجاح',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateScores = async (
    officialId: string,
    scores: {
      response_speed_score?: number;
      execution_score?: number;
      followup_score?: number;
      respect_score?: number;
    }
  ) => {
    try {
      // Calculate overall score
      const validScores = Object.values(scores).filter((s) => s !== undefined && s !== null);
      const overall_score = validScores.length > 0
        ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
        : null;

      const { error } = await supabase
        .from('officials')
        .update({
          ...scores,
          overall_score,
        })
        .eq('id', officialId);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم تحديث النقاط بنجاح',
      });

      fetchOfficials();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, []);

  return {
    officials,
    loading,
    addOfficial,
    updateOfficial,
    deleteOfficial,
    assignOfficialToCase,
    updateScores,
    refetch: fetchOfficials,
  };
};
