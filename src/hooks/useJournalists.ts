import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Journalist {
  id: string;
  full_name: string;
  role: 'investigator' | 'journalist' | 'editor';
  phone_number: string;
  email: string | null;
  avatar_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useJournalists = () => {
  const [journalists, setJournalists] = useState<Journalist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJournalists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journalists')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setJournalists(data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الصحفيين',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addJournalist = async (journalist: Omit<Journalist, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('journalists')
        .insert([journalist]);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم إضافة الصحفي بنجاح',
      });

      fetchJournalists();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateJournalist = async (id: string, updates: Partial<Journalist>) => {
    try {
      const { error } = await supabase
        .from('journalists')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم تحديث الصحفي بنجاح',
      });

      fetchJournalists();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteJournalist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journalists')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم حذف الصحفي بنجاح',
      });

      fetchJournalists();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchJournalists();
  }, []);

  return {
    journalists,
    loading,
    addJournalist,
    updateJournalist,
    deleteJournalist,
    refetch: fetchJournalists,
  };
};
