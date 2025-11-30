import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, Users, TrendingUp, AlertTriangle, LogIn, LogOut, BarChart3, Clock, CheckCircle, XCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeStats } from "@/hooks/useHomeStats";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { data, isLoading } = useHomeStats();

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

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="سقط القناع" className="h-12 w-12" />
            <div>
              <h1 className="text-xl font-bold text-foreground">سقط القناع</h1>
              <p className="text-xs text-muted-foreground">Saqat Al Qina3</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/about">
              <Button variant="ghost" size="sm">من نحن؟</Button>
            </Link>
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/dashboard">قضاياي</Link>
                </Button>
                {isAdmin() && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin">لوحة الإدارة</Link>
                  </Button>
                )}
                <Button asChild size="sm">
                  <Link to="/submit">قدّم قضية</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="ml-2 h-4 w-4" />
                  خروج
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">
                  <LogIn className="ml-2 h-4 w-4" />
                  دخول
                </Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border bg-gradient-to-b from-card to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            منصّة شعبية تراقب، توثّق، وتقيّم أداء المسؤولين في لبنان
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            من دون سبّ، من دون تحريض، ومن دون أجندات حزبية.
            <br />
            سقط القناع بيحطّ الضوء عالقضايا اللي بتهمّ الناس، وبيراقب كيف عم يتصرّف المسؤول قدّامها.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
                قدّم قضية جديدة
              </Button>
            </Link>
            <Link to="/cases">
              <Button size="lg" variant="outline" className="border-primary text-foreground hover:bg-secondary font-semibold px-8">
                استعرض القضايا
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 px-4 bg-card border-b border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card className="bg-secondary border-border hover:border-primary transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="h-5 w-5 text-primary ml-2" />
                      <p className="text-3xl font-bold text-foreground">{data?.stats.total || 0}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">إجمالي القضايا</p>
                  </CardContent>
                </Card>

                <Card className="bg-secondary border-border hover:border-primary transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FileText className="h-5 w-5 text-primary ml-2" />
                      <p className="text-3xl font-bold text-foreground">{data?.stats.published || 0}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">قضايا منشورة</p>
                  </CardContent>
                </Card>

                <Card className="bg-secondary border-border hover:border-primary transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                      <p className="text-3xl font-bold text-foreground">{data?.stats.resolved || 0}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">قضايا محلولة</p>
                  </CardContent>
                </Card>

                <Card className="bg-secondary border-border hover:border-primary transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <XCircle className="h-5 w-5 text-alert ml-2" />
                      <p className="text-3xl font-bold text-foreground">{data?.stats.ignored || 0}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">قضايا متجاهلة</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Latest Cases Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">آخر القضايا المنشورة</h2>
              <p className="text-muted-foreground">تابع أحدث القضايا التي تم نشرها على المنصة</p>
            </div>
            <Link to="/cases">
              <Button variant="outline">عرض الكل</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data?.latestCases && data.latestCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.latestCases.map((caseItem, index) => (
                <Card key={caseItem.id} className={`bg-card border-border hover:border-primary transition-colors ${index === 0 ? 'md:col-span-2' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {index === 0 ? (
                        <>
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="text-sm font-semibold text-primary">القضية الأحدث</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(caseItem.created_at).toLocaleDateString('ar')}
                          </span>
                        </>
                      )}
                    </div>
                    <CardTitle className={index === 0 ? 'text-2xl' : 'text-xl'}>
                      {caseItem.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {caseItem.short_description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="text-sm px-2 py-1 bg-secondary rounded text-muted-foreground">
                          {regionLabels[caseItem.region] || caseItem.region}
                        </span>
                        <span className="text-sm px-2 py-1 bg-secondary rounded text-muted-foreground">
                          {categoryLabels[caseItem.category] || caseItem.category}
                        </span>
                      </div>
                      <Link to={`/case/${caseItem.id}`}>
                        <Button variant="ghost" size="sm" className="hover:text-primary">
                          اقرأ المزيد ←
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد قضايا منشورة حالياً</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Officials Rankings Section */}
      <section className="py-16 px-4 bg-card border-t border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">تقييم المسؤولين</h2>
              <p className="text-muted-foreground">أداء المسؤولين بناءً على استجابتهم للقضايا</p>
            </div>
            <Link to="/scoreboard">
              <Button variant="outline">لوحة النقاط الكاملة</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Responsive Officials */}
            <Card className="bg-secondary border-border">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-semibold text-green-500">أفضل المسؤولين أداءً</span>
                </div>
                <CardTitle className="text-lg text-foreground">أعلى التقييمات</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : data?.topOfficials && data.topOfficials.length > 0 ? (
                  <div className="space-y-3">
                    {data.topOfficials.map((official, index) => (
                      <div key={official.id} className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-background font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{official.name}</p>
                            <p className="text-xs text-muted-foreground">{official.position}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold text-green-500">{official.overall_score?.toFixed(1) || '0.0'}/20</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">لا توجد بيانات متاحة</p>
                )}
                <Link to="/scoreboard">
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    عرض الترتيب الكامل ←
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Least Responsive Officials */}
            <Card className="bg-secondary border-border">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-alert" />
                  <span className="text-sm font-semibold text-alert">أقل المسؤولين استجابة</span>
                </div>
                <CardTitle className="text-lg text-foreground">أدنى التقييمات</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : data?.worstOfficials && data.worstOfficials.length > 0 ? (
                  <div className="space-y-3">
                    {data.worstOfficials.map((official, index) => (
                      <div key={official.id} className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-alert rounded-full flex items-center justify-center text-alert-foreground font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{official.name}</p>
                            <p className="text-xs text-muted-foreground">{official.position}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold text-alert">{official.overall_score?.toFixed(1) || '0.0'}/20</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">لا توجد بيانات متاحة</p>
                )}
                <Link to="/scoreboard">
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    عرض الترتيب الكامل ←
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-card border-t border-border">
        <div className="container mx-auto max-w-3xl text-center">
          <AlertTriangle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            عندك قضية؟ صوتك لازم ينسمع!
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            ما تسكت! قدّم قضيتك الآن وخلّي المسؤولين يشوفوا شو عم يصير.
            <br />
            كل صوت بيحدث فرق، وكل قضية بتستاهل تنحل.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/submit">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
                  <FileText className="ml-2 h-5 w-5" />
                  قدّم قضيتك الآن
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
                    <LogIn className="ml-2 h-5 w-5" />
                    سجّل دخول وقدّم قضية
                  </Button>
                </Link>
                <Link to="/cases">
                  <Button size="lg" variant="outline" className="border-primary font-semibold px-8">
                    تصفح القضايا الحالية
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
