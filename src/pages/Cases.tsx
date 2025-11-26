import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Filter } from "lucide-react";
import logo from "@/assets/logo.png";

const Cases = () => {
  const mockCases = [
    {
      id: 1,
      title: "انقطاع المياه في منطقة الحمرا منذ أسبوعين",
      location: "بيروت",
      category: "بلدية",
      status: "waiting_response",
      statusText: "بانتظار الرد",
      thumbnail: "🚰"
    },
    {
      id: 2,
      title: "تراكم النفايات في صيدا القديمة",
      location: "الجنوب",
      category: "بيئة",
      status: "sent_to_official",
      statusText: "تم إرسال الطلب",
      thumbnail: "🗑️"
    },
    {
      id: 3,
      title: "انقطاع الكهرباء المستمر في طرابلس",
      location: "الشمال",
      category: "كهرباء",
      status: "official_replied",
      statusText: "رد المسؤول",
      thumbnail: "⚡"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "waiting_response": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "sent_to_official": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "official_replied": return "bg-green-500/20 text-green-500 border-green-500/50";
      case "ignored": return "bg-alert/20 text-alert border-alert/50";
      default: return "bg-muted text-muted-foreground border-border";
    }
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
          <Link to="/submit">
            <Button className="bg-primary hover:bg-primary/90">قدّم قضية</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">جميع القضايا</h1>
            <p className="text-muted-foreground">تصفّح القضايا المقدمة من المواطنين</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            تصفية
          </Button>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCases.map((caseItem) => (
            <Card key={caseItem.id} className="bg-card border-border hover:border-primary transition-all cursor-pointer">
              <CardHeader>
                <div className="text-4xl mb-3">{caseItem.thumbnail}</div>
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{caseItem.category}</Badge>
                  <Badge variant="outline" className="text-xs">{caseItem.location}</Badge>
                </div>
                <CardTitle className="text-lg text-foreground leading-tight">
                  {caseItem.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${getStatusColor(caseItem.status)}`}>
                    {caseItem.statusText}
                  </Badge>
                  <Link to={`/case/${caseItem.id}`}>
                    <Button variant="ghost" size="sm">
                      التفاصيل ←
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cases;
