import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";
import logo from "@/assets/logo.png";

const Scoreboard = () => {
  const topOfficials = [
    { rank: 1, name: "بلدية جونيه", score: 18, speed: 5, execution: 5, followup: 4, respect: 4 },
    { rank: 2, name: "بلدية برج حمود", score: 16, speed: 4, execution: 5, followup: 4, respect: 3 },
    { rank: 3, name: "بلدية بيت مري", score: 15, speed: 4, execution: 4, followup: 4, respect: 3 },
  ];

  const bottomOfficials = [
    { rank: 1, name: "بلدية طرابلس", score: 4, speed: 1, execution: 1, followup: 1, respect: 1 },
    { rank: 2, name: "بلدية صور", score: 5, speed: 1, execution: 2, followup: 1, respect: 1 },
    { rank: 3, name: "بلدية بعلبك", score: 6, speed: 2, execution: 1, followup: 2, respect: 1 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 15) return "text-green-500";
    if (score >= 10) return "text-yellow-500";
    return "text-alert";
  };

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="سقط القناع" className="h-12 w-12" />
            <div>
              <h1 className="text-xl font-bold text-foreground">سقط القناع</h1>
              <p className="text-xs text-muted-foreground">Saqat Al Qina3</p>
            </div>
          </Link>
          <Link to="/cases">
            <Button variant="ghost" size="sm">استعرض القضايا</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">مؤشر الاستجابة الشعبية</h1>
          <p className="text-lg text-muted-foreground">ترتيب المسؤولين والجهات الرسمية بناءً على أدائهم</p>
        </div>

        {/* Scoring Legend */}
        <Card className="bg-card border-border mb-12">
          <CardHeader>
            <CardTitle className="text-center">معايير التقييم (من 20)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">سرعة الاستجابة</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">تنفيذ الحل</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">المتابعة</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">الاحترام</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 10 Cooperative Officials */}
        <div className="mb-12">
          <Card className="bg-card border-green-500/50">
            <CardHeader>
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <CardTitle className="text-2xl text-center">أكثر 10 مسؤولين تجاوبًا</CardTitle>
              </div>
              <p className="text-center text-muted-foreground">الجهات الأكثر التزامًا بالمساءلة والشفافية</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topOfficials.map((official) => (
                  <div 
                    key={official.rank}
                    className="flex items-center gap-4 p-4 bg-secondary rounded-lg border border-border hover:border-green-500/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {official.rank}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-2">{official.name}</h3>
                      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <div>السرعة: {official.speed}/5</div>
                        <div>التنفيذ: {official.execution}/5</div>
                        <div>المتابعة: {official.followup}/5</div>
                        <div>الاحترام: {official.respect}/5</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className={`text-3xl font-bold ${getScoreColor(official.score)}`}>{official.score}</p>
                      <p className="text-xs text-muted-foreground">من 20</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom 10 Ignoring Officials */}
        <div>
          <Card className="bg-card border-alert/50">
            <CardHeader>
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingDown className="h-6 w-6 text-alert" />
                <CardTitle className="text-2xl text-center">أكثر 10 جهات تجاهلاً</CardTitle>
              </div>
              <p className="text-center text-muted-foreground">الجهات التي تحتاج إلى تحسين أدائها</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bottomOfficials.map((official) => (
                  <div 
                    key={official.rank}
                    className="flex items-center gap-4 p-4 bg-secondary rounded-lg border border-border hover:border-alert/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-alert rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {official.rank}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-2">{official.name}</h3>
                      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <div>السرعة: {official.speed}/5</div>
                        <div>التنفيذ: {official.execution}/5</div>
                        <div>المتابعة: {official.followup}/5</div>
                        <div>الاحترام: {official.respect}/5</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className={`text-3xl font-bold ${getScoreColor(official.score)}`}>{official.score}</p>
                      <p className="text-xs text-muted-foreground">من 20</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
