import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  slug: string;
  assigned_journalist: string | null;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الفئات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const assignJournalistToCategory = async (categoryId: string, journalistId: string | null) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ assigned_journalist: journalistId })
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم تعيين الصحفي للفئة بنجاح',
      });

      fetchCategories();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    assignJournalistToCategory,
    refetch: fetchCategories,
  };
};
