import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, FileImage, FileVideo, Loader2 } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useAuth } from '@/contexts/AuthContext';

interface FileUploadProps {
  onFileUploaded: (url: string, path: string, type: string) => void;
  maxFiles?: number;
  accept?: string;
}

interface UploadedFile {
  url: string;
  path: string;
  type: string;
  name: string;
}

export default function FileUpload({ 
  onFileUploaded, 
  maxFiles = 5,
  accept = 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm'
}: FileUploadProps) {
  const { user } = useAuth();
  const { uploadFile, deleteFile, uploading } = useFileUpload();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files) return;

    const files = Array.from(event.target.files);
    
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`يمكنك رفع ${maxFiles} ملفات كحد أقصى`);
      return;
    }

    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        alert(`حجم الملف ${file.name} كبير جداً. الحد الأقصى 50 ميجابايت`);
        continue;
      }

      const result = await uploadFile(file, user.id);
      
      if (result) {
        const uploadedFile: UploadedFile = {
          url: result.url,
          path: result.path,
          type: result.type,
          name: file.name,
        };
        
        setUploadedFiles(prev => [...prev, uploadedFile]);
        onFileUploaded(result.url, result.path, result.type);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = async (index: number) => {
    const file = uploadedFiles[index];
    const success = await deleteFile(file.path);
    
    if (success) {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const isImage = (type: string) => type.startsWith('image/');
  const isVideo = (type: string) => type.startsWith('video/');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || uploadedFiles.length >= maxFiles}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الرفع...
            </>
          ) : (
            <>
              <Upload className="ml-2 h-4 w-4" />
              رفع صور أو فيديوهات ({uploadedFiles.length}/{maxFiles})
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedFiles.map((file, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {isImage(file.type) ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : isVideo(file.type) ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileVideo className="h-12 w-12 text-muted-foreground" />
                    <video 
                      src={file.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>
                ) : (
                  <FileImage className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        الصيغ المدعومة: JPG, PNG, GIF, WebP, MP4, WebM • الحد الأقصى للحجم: 50 ميجابايت
      </p>
    </div>
  );
}
