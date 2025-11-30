import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Paperclip,
  Eye
} from 'lucide-react';

interface UserCaseCardProps {
  caseItem: {
    id: string;
    title: string;
    short_description: string;
    status: string;
    category: string;
    region: string;
    created_at: string;
    case_evidence?: any[];
    comments?: any[];
    case_timeline_events?: any[];
  };
}

export const UserCaseCard = ({ caseItem }: UserCaseCardProps) => {
  const statusLabels: Record<string, string> = {
    draft: 'مسودة',
    pending_review: 'قيد المراجعة',
    published: 'منشور',
    sent_to_official: 'تم إرساله للمسؤول',
    waiting_response: 'بانتظار الرد',
    official_replied: 'تم الرد من المسؤول',
    follow_up: 'متابعة',
    resolved: 'محلول',
    ignored: 'متجاهل',
    closed: 'مغلق',
  };

  const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    draft: 'outline',
    pending_review: 'secondary',
    published: 'default',
    sent_to_official: 'default',
    waiting_response: 'secondary',
    official_replied: 'default',
    follow_up: 'secondary',
    resolved: 'default',
    ignored: 'destructive',
    closed: 'destructive',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'ignored':
      case 'closed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const categoryLabels: Record<string, string> = {
    municipality: 'بلدية',
    corruption: 'فساد',
    environment: 'بيئة',
    education: 'تعليم',
    health: 'صحة',
    electricity: 'كهرباء',
    water: 'مياه',
    roads: 'طرقات',
    other: 'أخرى',
  };

  const regionLabels: Record<string, string> = {
    beirut: 'بيروت',
    mount_lebanon: 'جبل لبنان',
    north: 'الشمال',
    south: 'الجنوب',
    bekaa: 'البقاع',
    nabatieh: 'النبطية',
  };

  const approvedCommentsCount = caseItem.comments?.filter(c => c.is_approved)?.length || 0;
  const evidenceCount = caseItem.case_evidence?.length || 0;
  const eventsCount = caseItem.case_timeline_events?.length || 0;

  return (
    <Card className="bg-card border-border hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(caseItem.status)}
              <Badge variant={statusVariants[caseItem.status]}>
                {statusLabels[caseItem.status]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(caseItem.created_at).toLocaleDateString('ar-LB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <CardTitle className="text-xl mb-2">{caseItem.title}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {caseItem.short_description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-secondary">
              {regionLabels[caseItem.region] || caseItem.region}
            </Badge>
            <Badge variant="outline" className="bg-secondary">
              {categoryLabels[caseItem.category] || caseItem.category}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Paperclip className="h-4 w-4" />
                <span>{evidenceCount} مرفقات</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{approvedCommentsCount} تعليقات</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{eventsCount} تحديثات</span>
              </div>
            </div>
          </div>

          <Link to={`/case/${caseItem.id}`}>
            <Button variant="outline" className="w-full">
              <Eye className="ml-2 h-4 w-4" />
              عرض التفاصيل الكاملة
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
