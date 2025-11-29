import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRight, MapPin, Calendar, User, Tag } from 'lucide-react';
import { useCaseDetails } from '@/hooks/useCaseDetails';
import { useAuth } from '@/contexts/AuthContext';
import CaseEvidence from '@/components/CaseEvidence';
import CaseComments from '@/components/CaseComments';
import CaseTimeline from '@/components/CaseTimeline';
import OfficialResponses from '@/components/OfficialResponses';

const CaseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const {
    caseData,
    evidence,
    comments,
    timeline,
    officialResponses,
    loading,
    updateCaseStatus,
    addComment,
  } = useCaseDetails(id!);

  const canUpdateStatus = userRole === 'admin' || userRole === 'investigator';

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'مسودة',
      pending_review: 'قيد المراجعة',
      published: 'منشورة',
      sent_to_official: 'مرسلة للمسؤول',
      waiting_response: 'بانتظار الرد',
      official_replied: 'تم الرد',
      follow_up: 'متابعة',
      resolved: 'تم الحل',
      ignored: 'تم التجاهل',
      closed: 'مغلقة',
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'resolved') return 'default';
    if (status === 'published' || status === 'official_replied') return 'secondary';
    if (status === 'ignored' || status === 'closed') return 'destructive';
    return 'outline';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
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
    return labels[category] || category;
  };

  const getRegionLabel = (region: string) => {
    const labels: Record<string, string> = {
      beirut: 'بيروت',
      mount_lebanon: 'جبل لبنان',
      north: 'الشمال',
      south: 'الجنوب',
      bekaa: 'البقاع',
      nabatieh: 'النبطية',
    };
    return labels[region] || region;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">القضية غير موجودة</h2>
            <p className="text-muted-foreground mb-4">لم يتم العثور على القضية المطلوبة</p>
            <Button onClick={() => navigate('/cases')}>العودة للقضايا</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          رجوع
        </Button>

        {/* Case Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-3">{caseData.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={getStatusVariant(caseData.status)}>
                    {getStatusLabel(caseData.status)}
                  </Badge>
                  <Badge variant="outline">
                    <Tag className="ml-1 h-3 w-3" />
                    {getCategoryLabel(caseData.category)}
                  </Badge>
                  <Badge variant="outline">
                    <MapPin className="ml-1 h-3 w-3" />
                    {getRegionLabel(caseData.region)}
                    {caseData.municipality && ` - ${caseData.municipality}`}
                  </Badge>
                </div>
              </div>

              {/* Status Update (Admin/Journalist) */}
              {canUpdateStatus && (
                <div className="w-full md:w-auto">
                  <Select
                    value={caseData.status}
                    onValueChange={(value) => updateCaseStatus(value)}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="تحديث الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="pending_review">قيد المراجعة</SelectItem>
                      <SelectItem value="published">منشورة</SelectItem>
                      <SelectItem value="sent_to_official">مرسلة للمسؤول</SelectItem>
                      <SelectItem value="waiting_response">بانتظار الرد</SelectItem>
                      <SelectItem value="official_replied">تم الرد</SelectItem>
                      <SelectItem value="follow_up">متابعة</SelectItem>
                      <SelectItem value="resolved">تم الحل</SelectItem>
                      <SelectItem value="ignored">تم التجاهل</SelectItem>
                      <SelectItem value="closed">مغلقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(caseData.created_at).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {caseData.journalists && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>الصحفي: {caseData.journalists.full_name}</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">الوصف المختصر</h3>
              <p className="text-muted-foreground leading-relaxed">
                {caseData.short_description}
              </p>
            </div>

            {/* Detailed Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">التفاصيل الكاملة</h3>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {caseData.detailed_description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Evidence */}
        <div className="mb-6">
          <CaseEvidence evidence={evidence} />
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <CaseTimeline timeline={timeline} />
        </div>

        {/* Official Responses */}
        <div className="mb-6">
          <OfficialResponses responses={officialResponses} />
        </div>

        {/* Comments */}
        <div>
          <CaseComments comments={comments} onAddComment={addComment} />
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
