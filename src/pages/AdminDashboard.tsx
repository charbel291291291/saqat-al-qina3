import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle, XCircle, Eye } from 'lucide-react';

interface CaseItem {
  id: string;
  title: string;
  short_description: string;
  category: string;
  region: string;
  status: string;
  created_at: string;
  submitted_by: string | null;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin()) {
      fetchCases();
    }
  }, [user, isAdmin]);

  const fetchCases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('خطأ في تحميل القضايا');
      console.error(error);
    } else {
      setCases(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (caseId: string) => {
    const { error } = await supabase
      .from('cases')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        admin_notes: adminNotes || null,
      })
      .eq('id', caseId);

    if (error) {
      toast.error('خطأ في الموافقة على القضية');
      console.error(error);
    } else {
      toast.success('تم نشر القضية بنجاح');
      fetchCases();
      setSelectedCase(null);
      setAdminNotes('');
    }
  };

  const handleReject = async (caseId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('يرجى إدخال سبب الرفض');
      return;
    }

    const { error } = await supabase
      .from('cases')
      .update({
        status: 'closed',
        rejection_reason: rejectionReason,
        admin_notes: adminNotes || null,
      })
      .eq('id', caseId);

    if (error) {
      toast.error('خطأ في رفض القضية');
      console.error(error);
    } else {
      toast.success('تم رفض القضية');
      fetchCases();
      setSelectedCase(null);
      setAdminNotes('');
      setRejectionReason('');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      draft: { label: 'مسودة', variant: 'outline' },
      pending_review: { label: 'قيد المراجعة', variant: 'secondary' },
      published: { label: 'منشور', variant: 'default' },
      closed: { label: 'مغلق', variant: 'destructive' },
    };
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  const pendingCases = cases.filter(c => c.status === 'pending_review' || c.status === 'draft');
  const publishedCases = cases.filter(c => c.status === 'published');
  const allCases = cases;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/src/assets/logo.png" alt="Logo" className="h-10" />
            <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            الصفحة الرئيسية
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:border-primary cursor-pointer" onClick={() => navigate('/admin-team')}>
            <CardHeader>
              <CardTitle className="text-lg">إدارة الفريق</CardTitle>
              <CardDescription>إدارة الصحفيين والفئات</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary cursor-pointer" onClick={() => navigate('/admin/officials')}>
            <CardHeader>
              <CardTitle className="text-lg">إدارة المسؤولين</CardTitle>
              <CardDescription>المسؤولين الحكوميين ونظام التقييم</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary cursor-pointer" onClick={() => navigate('/scoreboard')}>
            <CardHeader>
              <CardTitle className="text-lg">لوحة النقاط</CardTitle>
              <CardDescription>تقييمات المسؤولين</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">قيد المراجعة ({pendingCases.length})</TabsTrigger>
            <TabsTrigger value="published">منشور ({publishedCases.length})</TabsTrigger>
            <TabsTrigger value="all">الكل ({allCases.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingCases.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  لا توجد قضايا قيد المراجعة
                </CardContent>
              </Card>
            ) : (
              pendingCases.map(caseItem => (
                <Card key={caseItem.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{caseItem.title}</CardTitle>
                        <CardDescription className="mt-2">{caseItem.short_description}</CardDescription>
                      </div>
                      {getStatusBadge(caseItem.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{caseItem.category}</Badge>
                      <Badge variant="outline">{caseItem.region}</Badge>
                    </div>
                    
                    {selectedCase?.id === caseItem.id ? (
                      <div className="space-y-4 border-t pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">ملاحظات الإدارة</label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="أضف ملاحظاتك..."
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">سبب الرفض (في حال الرفض)</label>
                          <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="اذكر سبب رفض القضية..."
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={() => handleApprove(caseItem.id)} className="flex-1">
                            <CheckCircle className="ml-2 h-4 w-4" />
                            موافقة ونشر
                          </Button>
                          <Button variant="destructive" onClick={() => handleReject(caseItem.id)} className="flex-1">
                            <XCircle className="ml-2 h-4 w-4" />
                            رفض
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedCase(null)}>
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setSelectedCase(caseItem)} variant="outline" className="w-full">
                        <Eye className="ml-2 h-4 w-4" />
                        مراجعة
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            {publishedCases.map(caseItem => (
              <Card key={caseItem.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{caseItem.title}</CardTitle>
                      <CardDescription className="mt-2">{caseItem.short_description}</CardDescription>
                    </div>
                    {getStatusBadge(caseItem.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{caseItem.category}</Badge>
                    <Badge variant="outline">{caseItem.region}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {allCases.map(caseItem => (
              <Card key={caseItem.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{caseItem.title}</CardTitle>
                      <CardDescription className="mt-2">{caseItem.short_description}</CardDescription>
                    </div>
                    {getStatusBadge(caseItem.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{caseItem.category}</Badge>
                    <Badge variant="outline">{caseItem.region}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
