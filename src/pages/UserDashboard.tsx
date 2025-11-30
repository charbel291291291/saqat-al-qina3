import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCases } from '@/hooks/useUserCases';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCaseCard } from '@/components/UserCaseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowRight, 
  FileText, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3
} from 'lucide-react';
import logo from '@/assets/logo.png';

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: cases, isLoading } = useUserCases();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  const allCases = cases || [];
  const draftCases = allCases.filter(c => c.status === 'draft');
  const pendingCases = allCases.filter(c => 
    c.status === 'pending_review' || 
    c.status === 'sent_to_official' || 
    c.status === 'waiting_response' ||
    c.status === 'follow_up'
  );
  const publishedCases = allCases.filter(c => 
    c.status === 'published' || 
    c.status === 'official_replied'
  );
  const resolvedCases = allCases.filter(c => c.status === 'resolved');
  const closedCases = allCases.filter(c => 
    c.status === 'closed' || 
    c.status === 'ignored'
  );

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">لوحة التحكم</h1>
              <p className="text-xs text-muted-foreground">قضاياي</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            الصفحة الرئيسية
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-secondary border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="h-5 w-5 text-primary ml-2" />
                <p className="text-3xl font-bold text-foreground">{allCases.length}</p>
              </div>
              <p className="text-sm text-muted-foreground">إجمالي القضايا</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-yellow-500 ml-2" />
                <p className="text-3xl font-bold text-foreground">{pendingCases.length}</p>
              </div>
              <p className="text-sm text-muted-foreground">قيد المتابعة</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                <p className="text-3xl font-bold text-foreground">{resolvedCases.length}</p>
              </div>
              <p className="text-sm text-muted-foreground">محلولة</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="h-5 w-5 text-alert ml-2" />
                <p className="text-3xl font-bold text-foreground">{closedCases.length}</p>
              </div>
              <p className="text-sm text-muted-foreground">مغلقة</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-6 w-6 text-primary" />
              هل لديك قضية جديدة؟
            </CardTitle>
            <CardDescription className="text-foreground/80">
              قدّم قضيتك الآن وتابع تطوراتها من هنا
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/submit">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <FileText className="ml-2 h-5 w-5" />
                تقديم قضية جديدة
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Cases Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="all">
              الكل ({allCases.length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              مسودات ({draftCases.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              قيد المتابعة ({pendingCases.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              منشورة ({publishedCases.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              محلولة ({resolvedCases.length})
            </TabsTrigger>
            <TabsTrigger value="closed">
              مغلقة ({closedCases.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allCases.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    لم تقدم أي قضايا بعد
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    ابدأ بتقديم أول قضية لك وتابع تطوراتها من هنا
                  </p>
                  <Link to="/submit">
                    <Button size="lg">
                      <PlusCircle className="ml-2 h-5 w-5" />
                      تقديم قضية جديدة
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allCases.map(caseItem => (
                  <UserCaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {draftCases.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  لا توجد مسودات
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {draftCases.map(caseItem => (
                  <UserCaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingCases.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  لا توجد قضايا قيد المتابعة
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingCases.map(caseItem => (
                  <UserCaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="published" className="space-y-4">
            {publishedCases.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  لا توجد قضايا منشورة
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {publishedCases.map(caseItem => (
                  <UserCaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedCases.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  لا توجد قضايا محلولة
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resolvedCases.map(caseItem => (
                  <UserCaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            {closedCases.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  لا توجد قضايا مغلقة
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {closedCases.map(caseItem => (
                  <UserCaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
