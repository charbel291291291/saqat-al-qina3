import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Scale, Heart, AlertCircle, Eye, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const About = () => {
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
          <Link to="/">
            <Button variant="ghost" size="sm">العودة للرئيسية</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Who We Are */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">من نحن؟</h1>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-lg text-foreground leading-relaxed mb-4">
                <strong className="text-primary">سقط القناع</strong> منصّة رقابة مجتمعية، مستقلة، ما بتمثل أي حزب.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                هدفها كشف الحقيقة من خلال قضايا الناس، وفتح حق الردّ أمام المسؤولين، مع احترام كرامة الجميع.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Principles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">مبادئنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">الكرامة أولاً</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نحترم كرامة جميع الأطراف، المواطنين والمسؤولين على حد سواء. لا مكان للإهانات أو التشهير.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">حق الرد</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  كل مسؤول له الحق الكامل بالرد والتوضيح. نحن نفتح المجال للحوار البناء.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">لا للتحريض</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نرفض أي محتوى يحرّض على العنف أو الكراهية. هدفنا المساءلة، ليس التأجيج.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">لا للطائفية</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  المنصة مستقلة تماماً عن أي انتماء طائفي أو حزبي. نحاسب على الأداء فقط.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">التحقق قبل النشر</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  كل قضية تمر بعملية تحقق قبل نشرها لضمان المصداقية والدقة.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">الشفافية</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نعمل بشفافية كاملة في عملية التوثيق والمتابعة والتقييم.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="mb-16">
          <Card className="bg-secondary border-alert">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">إخلاء مسؤولية قانوني</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                المحتوى المنشور على هذه المنصة هو مسؤولية صاحب القضية. المنصة تتحقق من المعلومات قدر الإمكان لكنها ليست محكمة قضائية.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                نحن نوفر منصة للتعبير والمساءلة الشفافة، مع احترام حق الرد والكرامة الإنسانية للجميع.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Report Button */}
        <section>
          <Card className="bg-card border-border text-center">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-foreground mb-4">لاحظت محتوى مخالف؟</h3>
              <p className="text-muted-foreground mb-6">
                إذا لاحظت أي محتوى يخالف مبادئنا، يرجى الإبلاغ عنه فوراً.
              </p>
              <Button className="bg-alert hover:bg-alert/90 text-alert-foreground">
                تبليغ عن محتوى مخالف
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
