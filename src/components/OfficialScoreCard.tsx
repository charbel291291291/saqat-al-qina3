import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Clock, Target, Heart } from 'lucide-react';
import { Official } from '@/hooks/useOfficials';

interface OfficialScoreCardProps {
  official: Official;
  onUpdateScores: (scores: any) => void;
  canEdit?: boolean;
}

const OfficialScoreCard = ({ official, onUpdateScores, canEdit = false }: OfficialScoreCardProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [scores, setScores] = useState({
    response_speed_score: official.response_speed_score || 0,
    execution_score: official.execution_score || 0,
    followup_score: official.followup_score || 0,
    respect_score: official.respect_score || 0,
  });

  const handleSave = () => {
    onUpdateScores(scores);
    setEditOpen(false);
  };

  const scoreCategories = [
    {
      key: 'response_speed_score',
      label: 'سرعة الاستجابة',
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      key: 'execution_score',
      label: 'التنفيذ',
      icon: Target,
      color: 'text-green-500',
    },
    {
      key: 'followup_score',
      label: 'المتابعة',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      key: 'respect_score',
      label: 'الاحترام',
      icon: Heart,
      color: 'text-red-500',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 15) return 'text-green-500';
    if (score >= 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              التقييم الشامل
            </CardTitle>
            {canEdit && (
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
                تعديل النقاط
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Score */}
          <div className="text-center p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">المعدل العام</p>
            <p className={`text-4xl font-bold ${getScoreColor(official.overall_score || 0)}`}>
              {official.overall_score?.toFixed(1) || '0.0'}/20
            </p>
          </div>

          {/* Individual Scores */}
          <div className="space-y-3">
            {scoreCategories.map((category) => {
              const Icon = category.icon;
              const score = (official as any)[category.key] || 0;
              return (
                <div key={category.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${category.color}`} />
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                      {score}/20
                    </span>
                  </div>
                  <Progress value={(score / 20) * 100} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تحديث نقاط التقييم</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {scoreCategories.map((category) => (
              <div key={category.key} className="space-y-2">
                <Label htmlFor={category.key}>
                  {category.label} (0-20)
                </Label>
                <Input
                  id={category.key}
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={(scores as any)[category.key]}
                  onChange={(e) =>
                    setScores({ ...scores, [category.key]: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSave}>حفظ</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfficialScoreCard;
