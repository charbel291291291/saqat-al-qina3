import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, Pencil, Trash2, Building2, Search, ArrowRight } from 'lucide-react';
import { useOfficials } from '@/hooks/useOfficials';
import { useInstitutions } from '@/hooks/useInstitutions';
import { useAuth } from '@/contexts/AuthContext';
import OfficialForm from '@/components/OfficialForm';
import OfficialScoreCard from '@/components/OfficialScoreCard';

const AdminOfficials = () => {
  const navigate = useNavigate();
  const { user, userRole, loading: authLoading } = useAuth();
  const { officials, loading, addOfficial, updateOfficial, deleteOfficial, updateScores } = useOfficials();
  const { institutions } = useInstitutions();

  const [formOpen, setFormOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedOfficialForScore, setSelectedOfficialForScore] = useState<any>(null);

  // Redirect if not admin
  if (!authLoading && (!user || userRole !== 'admin')) {
    navigate('/');
    return null;
  }

  const handleAdd = () => {
    setEditingOfficial(null);
    setFormOpen(true);
  };

  const handleEdit = (official: any) => {
    setEditingOfficial(official);
    setFormOpen(true);
  };

  const handleDelete = (official: any) => {
    setSelectedOfficial(official);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedOfficial) {
      await deleteOfficial(selectedOfficial.id);
      setDeleteDialogOpen(false);
      setSelectedOfficial(null);
    }
  };

  const handleSubmit = async (data: any) => {
    if (editingOfficial) {
      await updateOfficial(editingOfficial.id, data);
    } else {
      await addOfficial(data);
    }
  };

  const handleUpdateScores = async (scores: any) => {
    if (selectedOfficialForScore) {
      await updateScores(selectedOfficialForScore.id, scores);
      setSelectedOfficialForScore(null);
    }
  };

  const filteredOfficials = officials.filter((official) => {
    const matchesSearch =
      official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'all' || official.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const getRegionLabel = (region: string) => {
    const labels: Record<string, string> = {
      beirut: 'بيروت',
      mount_lebanon: 'جبل لبنان',
      north: 'الشمال',
      south: 'الجنوب',
      bekaa: 'البقاع',
      nabatieh: 'النبطية',
    };
    return labels[region] || region;
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
              <ArrowRight className="ml-2 h-4 w-4" />
              رجوع للوحة الإدارة
            </Button>
            <h1 className="text-4xl font-bold text-foreground">إدارة المسؤولين</h1>
            <p className="text-muted-foreground">إدارة المسؤولين الحكوميين ونظام التقييم</p>
          </div>
          <Button onClick={handleAdd} size="lg">
            <Plus className="ml-2 h-5 w-5" />
            إضافة مسؤول
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المسؤولين</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{officials.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">أعلى تقييم</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {Math.max(...officials.map((o) => o.overall_score || 0)).toFixed(1)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">أدنى تقييم</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                {Math.min(...officials.map((o) => o.overall_score || 0)).toFixed(1)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">المتوسط العام</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-500">
                {officials.length > 0
                  ? (
                      officials.reduce((sum, o) => sum + (o.overall_score || 0), 0) / officials.length
                    ).toFixed(1)
                  : '0.0'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم أو المنصب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="فلترة حسب المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المناطق</SelectItem>
                  <SelectItem value="beirut">بيروت</SelectItem>
                  <SelectItem value="mount_lebanon">جبل لبنان</SelectItem>
                  <SelectItem value="north">الشمال</SelectItem>
                  <SelectItem value="south">الجنوب</SelectItem>
                  <SelectItem value="bekaa">البقاع</SelectItem>
                  <SelectItem value="nabatieh">النبطية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Officials List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOfficials.map((official) => (
            <Card key={official.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={official.image_url || undefined} />
                      <AvatarFallback>{official.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{official.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{official.position}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{getRegionLabel(official.region)}</Badge>
                        {official.institutions && (
                          <Badge variant="outline" className="gap-1">
                            <Building2 className="h-3 w-3" />
                            {official.institutions.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOfficialForScore(official)}
                    >
                      📊
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(official)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(official)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">التقييم العام</p>
                    <p className="font-bold text-lg">{official.overall_score?.toFixed(1) || '0.0'}/20</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">سرعة الاستجابة</p>
                    <p className="font-bold">{official.response_speed_score || 0}/20</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">التنفيذ</p>
                    <p className="font-bold">{official.execution_score || 0}/20</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">المتابعة</p>
                    <p className="font-bold">{official.followup_score || 0}/20</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOfficials.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">لا يوجد مسؤولين مطابقين للبحث</p>
            </CardContent>
          </Card>
        )}

        {/* Official Form */}
        <OfficialForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleSubmit}
          official={editingOfficial}
          institutions={institutions}
        />

        {/* Score Card Dialog */}
        {selectedOfficialForScore && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full">
              <OfficialScoreCard
                official={selectedOfficialForScore}
                onUpdateScores={handleUpdateScores}
                canEdit={true}
              />
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setSelectedOfficialForScore(null)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف المسؤول "{selectedOfficial?.name}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminOfficials;
