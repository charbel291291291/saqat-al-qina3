import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Official } from '@/hooks/useOfficials';
import { Institution } from '@/hooks/useInstitutions';

const officialSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  position: z.string().min(2, 'المنصب مطلوب'),
  region: z.enum(['beirut', 'mount_lebanon', 'north', 'south', 'bekaa', 'nabatieh']),
  institution_id: z.string().optional(),
  image_url: z.string().url('رابط الصورة غير صحيح').optional().or(z.literal('')),
});

interface OfficialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  official?: Official | null;
  institutions: Institution[];
}

const OfficialForm = ({ open, onOpenChange, onSubmit, official, institutions }: OfficialFormProps) => {
  const form = useForm<z.infer<typeof officialSchema>>({
    resolver: zodResolver(officialSchema),
    defaultValues: {
      name: official?.name || '',
      position: official?.position || '',
      region: official?.region || 'beirut',
      institution_id: official?.institution_id || '',
      image_url: official?.image_url || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof officialSchema>) => {
    onSubmit({
      ...values,
      institution_id: values.institution_id || null,
      image_url: values.image_url || null,
      overall_score: official?.overall_score || 0,
      response_speed_score: official?.response_speed_score || 0,
      execution_score: official?.execution_score || 0,
      followup_score: official?.followup_score || 0,
      respect_score: official?.respect_score || 0,
    });
    form.reset();
    onOpenChange(false);
  };

  const regions = [
    { value: 'beirut', label: 'بيروت' },
    { value: 'mount_lebanon', label: 'جبل لبنان' },
    { value: 'north', label: 'الشمال' },
    { value: 'south', label: 'الجنوب' },
    { value: 'bekaa', label: 'البقاع' },
    { value: 'nabatieh', label: 'النبطية' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{official ? 'تعديل مسؤول' : 'إضافة مسؤول جديد'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input id="name" {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">المنصب *</Label>
              <Input id="position" {...form.register('position')} />
              {form.formState.errors.position && (
                <p className="text-sm text-destructive">{form.formState.errors.position.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">المنطقة *</Label>
              <Select
                value={form.watch('region')}
                onValueChange={(value) => form.setValue('region', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">المؤسسة</Label>
              <Select
                value={form.watch('institution_id')}
                onValueChange={(value) => form.setValue('institution_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المؤسسة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون مؤسسة</SelectItem>
                  {institutions.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image_url">رابط الصورة</Label>
              <Input id="image_url" type="url" {...form.register('image_url')} placeholder="https://example.com/image.jpg" />
              {form.formState.errors.image_url && (
                <p className="text-sm text-destructive">{form.formState.errors.image_url.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">
              {official ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfficialForm;
