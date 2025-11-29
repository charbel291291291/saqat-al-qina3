import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Institution {
  id: string;
  name: string;
  type: string;
  region: 'beirut' | 'mount_lebanon' | 'north' | 'south' | 'bekaa' | 'nabatieh' | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useInstitutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('name');

      if (error) throw error;
      setInstitutions(data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل المؤسسات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addInstitution = async (institution: Omit<Institution, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('institutions')
        .insert([institution]);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم إضافة المؤسسة بنجاح',
      });

      fetchInstitutions();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateInstitution = async (id: string, updates: Partial<Institution>) => {
    try {
      const { error } = await supabase
        .from('institutions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم تحديث المؤسسة بنجاح',
      });

      fetchInstitutions();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteInstitution = async (id: string) => {
    try {
      const { error } = await supabase
        .from('institutions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم حذف المؤسسة بنجاح',
      });

      fetchInstitutions();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return {
    institutions,
    loading,
    addInstitution,
    updateInstitution,
    deleteInstitution,
    refetch: fetchInstitutions,
  };
};
