import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadResult {
  url: string;
  path: string;
  type: string;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, userId: string): Promise<UploadResult | null> => {
    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { data, error } = await supabase.storage
        .from('case-evidence')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        toast.error('فشل رفع الملف');
        console.error('Upload error:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('case-evidence')
        .getPublicUrl(filePath);

      setProgress(100);
      toast.success('تم رفع الملف بنجاح');

      return {
        url: urlData.publicUrl,
        path: filePath,
        type: file.type,
      };
    } catch (error) {
      toast.error('حدث خطأ أثناء رفع الملف');
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      const { error } = await supabase.storage
        .from('case-evidence')
        .remove([filePath]);

      if (error) {
        toast.error('فشل حذف الملف');
        console.error('Delete error:', error);
        return false;
      }

      toast.success('تم حذف الملف بنجاح');
      return true;
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الملف');
      console.error('Delete error:', error);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    progress,
  };
}
