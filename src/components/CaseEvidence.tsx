import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, Video, FileIcon } from 'lucide-react';
import { CaseEvidence as Evidence } from '@/hooks/useCaseDetails';

interface CaseEvidenceProps {
  evidence: Evidence[];
}

const CaseEvidence = ({ evidence }: CaseEvidenceProps) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  if (evidence.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">الأدلة والمستندات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">لا توجد أدلة مرفقة بهذه القضية</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">الأدلة والمستندات ({evidence.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidence.map((item) => (
            <a
              key={item.id}
              href={item.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
            >
              {item.file_type.startsWith('image/') ? (
                <img
                  src={item.thumbnail_url || item.file_url}
                  alt="دليل"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-48 bg-secondary flex items-center justify-center">
                  {getFileIcon(item.file_type)}
                  <span className="mr-2 text-sm text-muted-foreground">
                    {item.file_type.split('/')[1]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-xs">
                  {new Date(item.created_at).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseEvidence;
