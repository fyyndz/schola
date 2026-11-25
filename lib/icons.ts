import {
  BookOpen,
  Brain,
  Calculator,
  Compass,
  FlaskConical,
  Lightbulb,
  PencilRuler,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const studyIconMap: Record<string, LucideIcon> = {
  calculator: Calculator,
  'flask-conical': FlaskConical,
  'book-open': BookOpen,
  sparkles: Sparkles,
  compass: Compass,
  brain: Brain,
  'pencil-ruler': PencilRuler,
  lightbulb: Lightbulb,
};

export function getStudyIcon(name?: string): LucideIcon {
  return studyIconMap[name ?? ''] ?? BookOpen;
}
