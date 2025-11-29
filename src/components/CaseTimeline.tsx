import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertCircle, Send, MessageSquare, XCircle } from 'lucide-react';
import { TimelineEvent } from '@/hooks/useCaseDetails';

interface CaseTimelineProps {
  timeline: TimelineEvent[];
}

const CaseTimeline = ({ timeline }: CaseTimelineProps) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'created':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent_to_official':
        return <Send className="h-4 w-4 text-purple-500" />;
      case 'official_replied':
        return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getEventLabel = (eventType: string) => {
    const labels: Record<string, string> = {
      created: 'تم إنشاء القضية',
      published: 'تم نشر القضية',
      sent_to_official: 'تم إرسالها للمسؤول',
      official_replied: 'رد المسؤول',
      resolved: 'تم حل القضية',
      closed: 'تم إغلاق القضية',
      updated: 'تم التحديث',
    };
    return labels[eventType] || eventType;
  };

  if (timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">الخط الزمني للقضية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">لا توجد أحداث في الخط الزمني</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">الخط الزمني للقضية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Vertical Line */}
          <div className="absolute right-[11px] top-2 bottom-2 w-0.5 bg-border" />

          {timeline.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center">
                  {getEventIcon(event.event_type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {getEventLabel(event.event_type)}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.event_description}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(event.created_at).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseTimeline;
