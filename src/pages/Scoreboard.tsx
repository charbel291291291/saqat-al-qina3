import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, TrendingUp, TrendingDown, Award, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

interface Official {
  id: string;
  name: string;
  position: string;
  region: string;
  image_url: string | null;
  overall_score: number | null;
  response_speed_score: number | null;
  respect_score: number | null;
  execution_score: number | null;
  followup_score: number | null;
  institution: {
    name: string;
    type: string;
  } | null;
}

const Scoreboard = () => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  useEffect(() => {
    fetchOfficials();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('officials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'officials',
        },
        () => {
          fetchOfficials();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOfficials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('officials')
      .select(`
        *,
        institutions (
          name,
          type
        )
      `)
      .order('overall_score', { ascending: false });

    if (error) {
      console.error('Error fetching officials:', error);
    } else {
      const mappedData: Official[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        position: item.position,
        region: item.region,
        image_url: item.image_url,
        overall_score: item.overall_score,
        response_speed_score: item.response_speed_score,
        respect_score: item.respect_score,
        execution_score: item.execution_score,
        followup_score: item.followup_score,
        institution: item.institutions,
      }));
      setOfficials(mappedData);
    }
    setLoading(false);
  };

  const regions = [
    { value: 'all', label: 'جميع المناطق' },
    { value: 'beirut', label: 'بيروت' },
    { value: 'mount_lebanon', label: 'جبل لبنان' },
    { value: 'north', label: 'الشمال' },
    { value: 'south', label: 'الجنوب' },
    { value: 'bekaa', label: 'البقاع' },
    { value: 'nabatieh', label: 'النبطية' },
  ];

  const filteredOfficials = selectedRegion === 'all' 
    ? officials 
    : officials.filter(o => o.region === selectedRegion);

  const topPerformers = filteredOfficials.slice(0, 10);
  const poorPerformers = [...filteredOfficials]
    .sort((a, b) => (a.overall_score || 0) - (b.overall_score || 0))
    .slice(0, 10);

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 15) return 'text-green-500';
    if (score >= 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number | null) => {
    if (!score) return 'غير متاح';
    return `${score}/20`;
  };

  const OfficialCard = ({ official, rank }: { official: Official; rank: number }) => (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {rank}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg text-foreground">{official.name}</h3>
                <p className="text-sm text-muted-foreground">{official.position}</p>
                {official.institution && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {official.institution.name}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline">{regions.find(r => r.value === official.region)?.label}</Badge>
                <div className={`text-2xl font-bold ${getScoreColor(official.overall_score)}`}>
                  {getScoreLabel(official.overall_score)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">سرعة الرد</span>
                  <span className={getScoreColor(official.response_speed_score)}>
                    {official.response_speed_score || 0}/20
                  </span>
                </div>
                <Progress value={(official.response_speed_score || 0) * 5} />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">الاحترام</span>
                  <span className={getScoreColor(official.respect_score)}>
                    {official.respect_score || 0}/20
                  </span>
                </div>
                <Progress value={(official.respect_score || 0) * 5} />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">التنفيذ</span>
                  <span className={getScoreColor(official.execution_score)}>
                    {official.execution_score || 0}/20
                  </span>
                </div>
                <Progress value={(official.execution_score || 0) * 5} />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">المتابعة</span>
                  <span className={getScoreColor(official.followup_score)}>
                    {official.followup_score || 0}/20
                  </span>
                </div>
                <Progress value={(official.followup_score || 0) * 5} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10" />
            <div>
              <h1 className="text-2xl font-bold">لوحة تقييم المسؤولين</h1>
              <p className="text-xs text-muted-foreground">Scoreboard</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowRight className="ml-2 h-4 w-4" />
              الصفحة الرئيسية
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {regions.map((region) => (
              <Button
                key={region.value}
                variant={selectedRegion === region.value ? 'default' : 'outline'}
                onClick={() => setSelectedRegion(region.value)}
                size="sm"
              >
                {region.label}
              </Button>
            ))}
          </div>
        </div>

        {filteredOfficials.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد بيانات متاحة للمنطقة المختارة</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="top" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="top" className="gap-2">
                <Award className="h-4 w-4" />
                الأفضل أداءً
              </TabsTrigger>
              <TabsTrigger value="poor" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                الأسوأ أداءً
              </TabsTrigger>
            </TabsList>

            <TabsContent value="top" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    أفضل 10 مسؤولين
                  </CardTitle>
                </CardHeader>
              </Card>
              {topPerformers.map((official, index) => (
                <OfficialCard key={official.id} official={official} rank={index + 1} />
              ))}
            </TabsContent>

            <TabsContent value="poor" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    أسوأ 10 مسؤولين
                  </CardTitle>
                </CardHeader>
              </Card>
              {poorPerformers.map((official, index) => (
                <OfficialCard key={official.id} official={official} rank={index + 1} />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Scoreboard;
