import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import { CaseComment } from '@/hooks/useCaseDetails';
import { useAuth } from '@/contexts/AuthContext';

interface CaseCommentsProps {
  comments: CaseComment[];
  onAddComment: (commentText: string, userId: string) => Promise<void>;
}

const CaseComments = ({ comments, onAddComment }: CaseCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    
    setSubmitting(true);
    try {
      await onAddComment(newComment.trim(), user.id);
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          التعليقات ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        {user ? (
          <div className="space-y-3">
            <Textarea
              placeholder="أضف تعليقك..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
              className="w-full md:w-auto"
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
            </Button>
            <p className="text-xs text-muted-foreground">
              سيتم مراجعة تعليقك قبل نشره للتأكد من التزامه بمعايير المنصة
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            يجب تسجيل الدخول لإضافة تعليق
          </p>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">لا توجد تعليقات بعد</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-secondary">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {comment.profiles?.full_name?.charAt(0) || 'م'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">
                      {comment.profiles?.full_name || 'مستخدم'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-foreground leading-relaxed">{comment.comment_text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseComments;
