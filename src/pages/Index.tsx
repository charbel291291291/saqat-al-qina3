import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, Users, TrendingUp, AlertTriangle, LogIn, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, signOut, isAdmin } = useAuth();
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
      <section className="relative py-20 px-4 border-b border-border">
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

      {/* Featured Blocks */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Featured Case of the Day */}
            <Card className="bg-card border-alert hover:border-alert/80 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-alert" />
                  <span className="text-sm font-semibold text-alert">ملف اليوم</span>
                </div>
                <CardTitle className="text-xl text-foreground">انقطاع المياه في منطقة الحمرا منذ أسبوعين</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  أهالي منطقة الحمرا يعانون من انقطاع كامل للمياه منذ أسبوعين، مع عدم وجود أي رد رسمي من البلدية.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">بيروت • بلدية</span>
                  <Button variant="ghost" size="sm" className="text-alert hover:text-alert/80">
                    اقرأ المزيد ←
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Latest Cases */}
            <Card className="bg-card border-border hover:border-border/80 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">آخر القضايا</span>
                </div>
                <CardTitle className="text-xl text-foreground">تراكم النفايات في صيدا</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  النفايات تتراكم في شوارع صيدا القديمة منذ 5 أيام دون أي معالجة من الجهات المختصة.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">الجنوب • بيئة</span>
                  <Button variant="ghost" size="sm" className="hover:text-foreground">
                    اقرأ المزيد ←
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rankings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Responsive */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-semibold text-green-500">أكثر المسؤولين تجاوبًا</span>
                </div>
                <CardTitle className="text-lg text-foreground">هذا الأسبوع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">بلدية جونيه</p>
                        <p className="text-xs text-muted-foreground">معدل استجابة 18/20</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Link to="/scoreboard">
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    عرض الترتيب الكامل ←
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Most Ignoring */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-alert" />
                  <span className="text-sm font-semibold text-alert">أكثر الجهات تجاهلًا</span>
                </div>
                <CardTitle className="text-lg text-foreground">هذا الأسبوع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-alert rounded-full flex items-center justify-center text-alert-foreground font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">بلدية طرابلس</p>
                        <p className="text-xs text-muted-foreground">معدل استجابة 4/20</p>
                      </div>
                    </div>
                  </div>
                </div>
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
    </div>
  );
};

export default Index;
