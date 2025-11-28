import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateWhatsAppLink, openWhatsApp } from '@/utils/whatsapp';
import logo from '@/assets/logo.png';
import FileUpload from '@/components/FileUpload';

const SubmitCase = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    region: '',
    municipality: '',
    short_description: '',
    detailed_description: '',
    confirmed: false,
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يجب تسجيل الدخول لتقديم قضية',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);

  const handleFileUpload = (url: string, path: string, type: string) => {
    setUploadedFiles(prev => [...prev, url]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.confirmed) {
      toast({
        title: 'تأكيد مطلوب',
        description: 'يجب تأكيد مسؤوليتك عن صحة المعلومات',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'خطأ',
        description: 'يجب تسجيل الدخول أولاً',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setSubmitting(true);

    try {
      // Find category to get assigned journalist
      const selectedCategory = categories.find(c => c.id === formData.category);
      
      // Insert case
      const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert([
          {
            title: formData.title,
            category: selectedCategory?.slug as any,
            region: formData.region as any,
            municipality: formData.municipality || null,
            short_description: formData.short_description,
            detailed_description: formData.detailed_description,
            submitted_by: user.id,
            assigned_journalist: selectedCategory?.assigned_journalist || null,
            status: 'pending_review',
          },
        ])
        .select()
        .single();

      if (caseError) throw caseError;

      // Upload evidence files if any
      if (uploadedFiles.length > 0) {
        const evidencePromises = uploadedFiles.map(fileUrl =>
          supabase.from('case_evidence').insert([
            {
              case_id: newCase.id,
              file_url: fileUrl,
              file_type: 'image', // TODO: detect actual file type
            },
          ])
        );

        await Promise.all(evidencePromises);
      }

      // If journalist is assigned, send WhatsApp notification
      if (selectedCategory?.assigned_journalist) {
        try {
          const { data: functionData, error: functionError } = await supabase.functions.invoke(
            'notify-journalist',
            {
              body: {
                caseId: newCase.id,
                journalistId: selectedCategory.assigned_journalist,
              },
            }
          );

          if (functionError) {
            console.error('Error calling edge function:', functionError);
          } else if (functionData?.whatsappLink) {
            // Auto-open WhatsApp
            openWhatsApp(functionData.whatsappLink);
          }
        } catch (error) {
          console.error('Error sending WhatsApp notification:', error);
          // Don't fail the whole submission if notification fails
        }
      }

      toast({
        title: 'تم إرسال القضية بنجاح',
        description: 'سيتم مراجعة قضيتك قريباً',
      });

      navigate('/cases');
    } catch (error: any) {
      console.error('Error submitting case:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل إرسال القضية',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <Button variant="ghost" size="sm">
              استعرض القضايا
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">قدّم قضية جديدة</h1>
          <p className="text-muted-foreground">
            املأ النموذج أدناه لتقديم قضيتك. سيتم مراجعتها والتحقق منها قبل النشر.
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl">معلومات القضية</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">عنوان القضية *</Label>
                <Input
                  id="title"
                  placeholder="مثال: انقطاع المياه في منطقة الحمرا"
                  className="bg-background border-border"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">الفئة *</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">المحافظة *</Label>
                  <Select
                    value={formData.region}
                    onValueChange={value => setFormData({ ...formData, region: value })}
                    required
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="اختر المحافظة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beirut">بيروت</SelectItem>
                      <SelectItem value="mount_lebanon">جبل لبنان</SelectItem>
                      <SelectItem value="north">الشمال</SelectItem>
                      <SelectItem value="south">الجنوب</SelectItem>
                      <SelectItem value="bekaa">البقاع</SelectItem>
                      <SelectItem value="nabatieh">النبطية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="municipality">البلدية / المنطقة</Label>
                  <Input
                    id="municipality"
                    placeholder="مثال: بلدية الحمرا"
                    className="bg-background border-border"
                    value={formData.municipality}
                    onChange={e => setFormData({ ...formData, municipality: e.target.value })}
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
                  value={formData.short_description}
                  onChange={e =>
                    setFormData({ ...formData, short_description: e.target.value })
                  }
                  required
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
                  value={formData.detailed_description}
                  onChange={e =>
                    setFormData({ ...formData, detailed_description: e.target.value })
                  }
                  required
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>الملفات المرفقة (صور، فيديو، صوت)</Label>
                <FileUpload
                  onFileUploaded={handleFileUpload}
                  maxFiles={10}
                />
              </div>

              {/* Confirmation */}
              <Card className="bg-secondary border-alert">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="confirm"
                      checked={formData.confirmed}
                      onCheckedChange={checked =>
                        setFormData({ ...formData, confirmed: checked as boolean })
                      }
                      className="mt-1"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="confirm" className="cursor-pointer text-foreground">
                        <strong>أنا مسؤول عن صحّة المعلومات</strong>
                      </Label>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        أقر بأن المعلومات المقدمة صحيحة وموثقة، وأن المنصة ستتحقق من المحتوى
                        قبل النشر. أنا أتحمل المسؤولية القانونية الكاملة عن أي معلومات كاذبة
                        أو مضللة.
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
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    'إرسال القضية للمراجعة'
                  )}
                </Button>
                <Link to="/" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={submitting}
                  >
                    إلغاء
                  </Button>
                </Link>
              </div>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-secondary border border-border rounded-lg">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  بعد إرسال القضية، سيقوم فريقنا بمراجعتها والتحقق من المعلومات. قد تستغرق
                  العملية من 24 إلى 48 ساعة. سنتواصل معك في حال احتجنا معلومات إضافية.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitCase;
