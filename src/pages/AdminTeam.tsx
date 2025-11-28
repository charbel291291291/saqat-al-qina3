import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJournalists, Journalist } from '@/hooks/useJournalists';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Edit, Users } from 'lucide-react';

const AdminTeam = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { journalists, loading, addJournalist, updateJournalist, deleteJournalist } = useJournalists();
  const { categories, assignJournalistToCategory } = useCategories();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJournalist, setEditingJournalist] = useState<Journalist | null>(null);
  const [workload, setWorkload] = useState<Record<string, { total: number; pending: number; closed: number }>>({});

  const [formData, setFormData] = useState({
    full_name: '',
    role: 'journalist' as 'investigator' | 'journalist' | 'editor',
    phone_number: '',
    email: '',
    avatar_url: null as string | null,
    active: true,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      navigate('/');
    }
  }, [user, authLoading, navigate, isAdmin]);

  useEffect(() => {
    // Fetch workload for each journalist
    const fetchWorkload = async () => {
      const workloadData: Record<string, { total: number; pending: number; closed: number }> = {};
      
      for (const journalist of journalists) {
        const { data } = await supabase
          .from('cases')
          .select('status')
          .eq('assigned_journalist', journalist.id);

        const total = data?.length || 0;
        const pending = data?.filter(c => c.status === 'pending_review').length || 0;
        const closed = data?.filter(c => c.status === 'closed').length || 0;

        workloadData[journalist.id] = { total, pending, closed };
      }

      setWorkload(workloadData);
    };

    if (journalists.length > 0) {
      fetchWorkload();
    }
  }, [journalists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingJournalist) {
      await updateJournalist(editingJournalist.id, formData);
    } else {
      await addJournalist(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      role: 'journalist',
      phone_number: '',
      email: '',
      avatar_url: null,
      active: true,
    });
    setEditingJournalist(null);
  };

  const handleEdit = (journalist: Journalist) => {
    setEditingJournalist(journalist);
    setFormData({
      full_name: journalist.full_name,
      role: journalist.role,
      phone_number: journalist.phone_number,
      email: journalist.email || '',
      avatar_url: journalist.avatar_url,
      active: journalist.active,
    });
    setIsDialogOpen(true);
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
            <h1 className="text-4xl font-bold text-foreground mb-2">إدارة الفريق</h1>
            <p className="text-muted-foreground">إدارة الصحفيين والفئات</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                إضافة صحفي
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingJournalist ? 'تعديل صحفي' : 'إضافة صحفي جديد'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">الاسم الكامل</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">الدور</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="journalist">صحفي</SelectItem>
                      <SelectItem value="investigator">محقق</SelectItem>
                      <SelectItem value="editor">محرر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone_number">رقم الواتساب</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="+966xxxxxxxxx"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">نشط</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingJournalist ? 'تحديث' : 'إضافة'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="journalists" className="space-y-4">
          <TabsList>
            <TabsTrigger value="journalists">
              <Users className="mr-2 h-4 w-4" />
              الصحفيون ({journalists.length})
            </TabsTrigger>
            <TabsTrigger value="categories">الفئات ({categories.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="journalists" className="space-y-4">
            {journalists.map((journalist) => (
              <Card key={journalist.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{journalist.full_name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{journalist.role}</Badge>
                        <Badge variant={journalist.active ? 'default' : 'secondary'}>
                          {journalist.active ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        📱 {journalist.phone_number}
                      </p>
                      {journalist.email && (
                        <p className="text-sm text-muted-foreground">
                          ✉️ {journalist.email}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(journalist)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">إجمالي القضايا:</span>{' '}
                      <span className="font-semibold">{workload[journalist.id]?.total || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">قيد المراجعة:</span>{' '}
                      <span className="font-semibold">{workload[journalist.id]?.pending || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">مغلقة:</span>{' '}
                      <span className="font-semibold">{workload[journalist.id]?.closed || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {categories.map((category) => {
              const assignedJournalist = journalists.find(j => j.id === category.assigned_journalist);
              
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <Badge variant="outline">{category.slug}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Label className="flex-shrink-0">الصحفي المسؤول:</Label>
                      <Select
                        value={category.assigned_journalist || 'none'}
                        onValueChange={(value) =>
                          assignJournalistToCategory(
                            category.id,
                            value === 'none' ? null : value
                          )
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue>
                            {assignedJournalist?.full_name || 'غير معيّن'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">غير معيّن</SelectItem>
                          {journalists
                            .filter(j => j.active)
                            .map(journalist => (
                              <SelectItem key={journalist.id} value={journalist.id}>
                                {journalist.full_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminTeam;
