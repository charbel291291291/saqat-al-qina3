import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

interface CaseItem {
  id: string;
  title: string;
  category: string;
  region: string;
  municipality: string | null;
  status: string;
  short_description: string;
  created_at: string;
}

const JournalistDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    published: 0,
    closed: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('assigned_journalist', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCases(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const pending = data?.filter(c => c.status === 'pending_review').length || 0;
      const published = data?.filter(c => c.status === 'published').length || 0;
      const closed = data?.filter(c => c.status === 'closed').length || 0;

      setStats({ total, pending, published, closed });
    } catch (error: any) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCases();

      // Set up real-time subscription
      const channel = supabase
        .channel('journalist-cases')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cases',
            filter: `assigned_journalist=eq.${user.id}`,
          },
          () => {
            fetchCases();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      draft: { label: 'مسودة', variant: 'secondary' },
      pending_review: { label: 'قيد المراجعة', variant: 'outline' },
      published: { label: 'منشورة', variant: 'default' },
      closed: { label: 'مغلقة', variant: 'destructive' },
    };

    const config = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filterCasesByStatus = (status: string) => {
    if (status === 'all') return cases;
    return cases.filter(c => c.status === status);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">لوحة الصحفي</h1>
          <p className="text-muted-foreground">إدارة القضايا المسندة إليك</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي القضايا</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">منشورة</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مغلقة</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.closed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Cases Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">الكل ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending_review">قيد المراجعة ({stats.pending})</TabsTrigger>
            <TabsTrigger value="published">منشورة ({stats.published})</TabsTrigger>
            <TabsTrigger value="closed">مغلقة ({stats.closed})</TabsTrigger>
          </TabsList>

          {['all', 'pending_review', 'published', 'closed'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              {filterCasesByStatus(tabValue).length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    لا توجد قضايا في هذه الفئة
                  </CardContent>
                </Card>
              ) : (
                filterCasesByStatus(tabValue).map(caseItem => (
                  <Card key={caseItem.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{caseItem.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{caseItem.category}</Badge>
                            <Badge variant="secondary">{caseItem.region}</Badge>
                            {caseItem.municipality && (
                              <Badge variant="secondary">{caseItem.municipality}</Badge>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(caseItem.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {caseItem.short_description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {new Date(caseItem.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <Button onClick={() => navigate(`/case/${caseItem.id}`)}>
                          فتح القضية
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default JournalistDashboard;
