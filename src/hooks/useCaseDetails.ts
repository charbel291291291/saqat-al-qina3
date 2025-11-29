import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CaseEvidence {
  id: string;
  file_url: string;
  file_type: string;
  thumbnail_url: string | null;
  created_at: string;
}

export interface CaseComment {
  id: string;
  user_id: string;
  comment_text: string;
  is_approved: boolean | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

export interface TimelineEvent {
  id: string;
  event_type: string;
  event_description: string;
  created_at: string;
}

export interface OfficialResponse {
  id: string;
  response_text: string;
  response_date: string;
  official_id: string;
  officials?: {
    name: string;
    position: string;
    image_url: string | null;
  };
}

export interface CaseDetails {
  id: string;
  title: string;
  category: string;
  region: string;
  municipality: string | null;
  status: string;
  short_description: string;
  detailed_description: string;
  created_at: string;
  published_at: string | null;
  assigned_journalist: string | null;
  journalists?: {
    full_name: string;
  };
}

export const useCaseDetails = (caseId: string) => {
  const [caseData, setCaseData] = useState<CaseDetails | null>(null);
  const [evidence, setEvidence] = useState<CaseEvidence[]>([]);
  const [comments, setComments] = useState<CaseComment[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [officialResponses, setOfficialResponses] = useState<OfficialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);

      // Fetch case details
      const { data: caseDetails, error: caseError } = await supabase
        .from('cases')
        .select(`
          *,
          journalists:assigned_journalist(full_name)
        `)
        .eq('id', caseId)
        .single();

      if (caseError) throw caseError;
      setCaseData(caseDetails);

      // Fetch evidence
      const { data: evidenceData, error: evidenceError } = await supabase
        .from('case_evidence')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (evidenceError) throw evidenceError;
      setEvidence(evidenceData || []);

      // Fetch approved comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('case_id', caseId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch profiles separately to avoid relation issues
      const commentsWithProfiles = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', comment.user_id)
            .single();
          
          return {
            ...comment,
            profiles: profile,
          };
        })
      );

      setComments(commentsWithProfiles);

      // Fetch timeline events
      const { data: timelineData, error: timelineError } = await supabase
        .from('case_timeline_events')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (timelineError) throw timelineError;
      setTimeline(timelineData || []);

      // Fetch official responses
      const { data: responsesData, error: responsesError } = await supabase
        .from('official_responses')
        .select(`
          *,
          officials:official_id(name, position, image_url)
        `)
        .eq('case_id', caseId)
        .order('response_date', { ascending: false });

      if (responsesError) throw responsesError;
      setOfficialResponses(responsesData || []);
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل بيانات القضية',
        variant: 'destructive',
      });
      console.error('Error fetching case details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCaseStatus = async (status: string) => {
    try {
      const validStatuses = [
        'draft',
        'pending_review',
        'published',
        'sent_to_official',
        'waiting_response',
        'official_replied',
        'follow_up',
        'resolved',
        'ignored',
        'closed',
      ];

      if (!validStatuses.includes(status)) {
        throw new Error('حالة غير صالحة');
      }

      const { error } = await supabase
        .from('cases')
        .update({ status: status as any })
        .eq('id', caseId);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم تحديث حالة القضية بنجاح',
      });

      fetchCaseDetails();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const addComment = async (commentText: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          case_id: caseId,
          user_id: userId,
          comment_text: commentText,
          is_approved: false,
        });

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم إرسال التعليق وهو بانتظار الموافقة',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (caseId) {
      fetchCaseDetails();

      // Set up real-time subscription for case updates
      const channel = supabase
        .channel(`case-${caseId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cases',
            filter: `id=eq.${caseId}`,
          },
          () => {
            fetchCaseDetails();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [caseId]);

  return {
    caseData,
    evidence,
    comments,
    timeline,
    officialResponses,
    loading,
    updateCaseStatus,
    addComment,
    refetch: fetchCaseDetails,
  };
};
