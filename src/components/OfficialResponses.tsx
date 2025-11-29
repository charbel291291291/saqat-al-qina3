import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { OfficialResponse } from '@/hooks/useCaseDetails';

interface OfficialResponsesProps {
  responses: OfficialResponse[];
}

const OfficialResponses = ({ responses }: OfficialResponsesProps) => {
  if (responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">ردود المسؤولين</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            لم يرد أي مسؤول على هذه القضية بعد
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5" />
          ردود المسؤولين ({responses.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {responses.map((response) => (
          <div
            key={response.id}
            className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
          >
            {/* Official Info */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={response.officials?.image_url || undefined} />
                <AvatarFallback>
                  {response.officials?.name?.charAt(0) || 'م'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-lg">
                  {response.officials?.name || 'مسؤول'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {response.officials?.position || 'منصب غير محدد'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {new Date(response.response_date).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Response Text */}
            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {response.response_text}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OfficialResponses;
