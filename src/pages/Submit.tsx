import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Submit = () => {
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

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">قدّم قضية جديدة</h1>
          <p className="text-muted-foreground">املأ النموذج أدناه لتقديم قضيتك. سيتم مراجعتها والتحقق منها قبل النشر.</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl">معلومات القضية</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">عنوان القضية *</Label>
                <Input 
                  id="title" 
                  placeholder="مثال: انقطاع المياه في منطقة الحمرا"
                  className="bg-background border-border"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">الفئة *</Label>
                <select 
                  id="category"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="">اختر الفئة</option>
                  <option value="municipality">بلدية</option>
                  <option value="corruption">فساد</option>
                  <option value="environment">بيئة</option>
                  <option value="education">مدرسة</option>
                  <option value="health">صحة</option>
                  <option value="electricity">كهرباء</option>
                  <option value="water">مياه</option>
                  <option value="roads">طرقات</option>
                </select>
              </div>

              {/* Region */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">المحافظة *</Label>
                  <select 
                    id="region"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  >
                    <option value="">اختر المحافظة</option>
                    <option value="beirut">بيروت</option>
                    <option value="mount_lebanon">جبل لبنان</option>
                    <option value="north">الشمال</option>
                    <option value="south">الجنوب</option>
                    <option value="bekaa">البقاع</option>
                    <option value="nabatieh">النبطية</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="municipality">البلدية / المنطقة</Label>
                  <Input 
                    id="municipality" 
                    placeholder="مثال: بلدية الحمرا"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="short-desc">وصف مختصر *</Label>
                <Textarea 
                  id="short-desc"
                  placeholder="وصف قصير للقضية (100-200 حرف)"
                  rows={3}
                  className="bg-background border-border resize-none"
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <Label htmlFor="detailed-desc">الوصف التفصيلي *</Label>
                <Textarea 
                  id="detailed-desc"
                  placeholder="اشرح القضية بالتفصيل مع ذكر الوقائع والتواريخ"
                  rows={6}
                  className="bg-background border-border resize-none"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="files">الملفات المرفقة (صور، فيديو، صوت)</Label>
                <Input 
                  id="files" 
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">يمكنك رفع صور أو فيديوهات أو تسجيلات صوتية توثق القضية</p>
              </div>

              {/* Confirmation */}
              <Card className="bg-secondary border-alert">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox id="confirm" className="mt-1" />
                    <div className="space-y-2">
                      <Label htmlFor="confirm" className="cursor-pointer text-foreground">
                        <strong>أنا مسؤول عن صحّة المعلومات</strong>
                      </Label>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        أقر بأن المعلومات المقدمة صحيحة وموثقة، وأن المنصة ستتحقق من المحتوى قبل النشر.
                        أنا أتحمل المسؤولية القانونية الكاملة عن أي معلومات كاذبة أو مضللة.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  إرسال القضية للمراجعة
                </Button>
                <Link to="/" className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    size="lg"
                  >
                    إلغاء
                  </Button>
                </Link>
              </div>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-secondary border border-border rounded-lg">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  بعد إرسال القضية، سيقوم فريقنا بمراجعتها والتحقق من المعلومات. 
                  قد تستغرق العملية من 24 إلى 48 ساعة. سنتواصل معك في حال احتجنا معلومات إضافية.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submit;
