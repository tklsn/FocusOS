import type { LucideIcon } from "@lucide/vue";
import {
  BookOpen,
  Briefcase,
  Code,
  Dumbbell,
  FlaskConical,
  GraduationCap,
  Heart,
  House,
  Leaf,
  Palette,
  Users,
  Wallet,
} from "@lucide/vue";
import type { AreaColor, AreaIcon } from "#shared/utils/areas";

export const AREA_ICON_STYLES: Record<
  AreaIcon,
  { component: LucideIcon; label: string }
> = {
  briefcase: { component: Briefcase, label: "Maleta" },
  "flask-conical": { component: FlaskConical, label: "Frasco" },
  "graduation-cap": { component: GraduationCap, label: "Capelo" },
  house: { component: House, label: "Casa" },
  heart: { component: Heart, label: "Coração" },
  "book-open": { component: BookOpen, label: "Livro" },
  dumbbell: { component: Dumbbell, label: "Haltere" },
  wallet: { component: Wallet, label: "Carteira" },
  users: { component: Users, label: "Pessoas" },
  palette: { component: Palette, label: "Paleta" },
  code: { component: Code, label: "Código" },
  leaf: { component: Leaf, label: "Folha" },
};

export const AREA_COLOR_STYLES: Record<
  AreaColor,
  { text: string; bg: string; label: string }
> = {
  slate: { text: "text-slate-500", bg: "bg-slate-500", label: "Cinza" },
  blue: { text: "text-blue-500", bg: "bg-blue-500", label: "Azul" },
  teal: { text: "text-teal-500", bg: "bg-teal-500", label: "Turquesa" },
  green: { text: "text-green-500", bg: "bg-green-500", label: "Verde" },
  amber: { text: "text-amber-500", bg: "bg-amber-500", label: "Âmbar" },
  orange: { text: "text-orange-500", bg: "bg-orange-500", label: "Laranja" },
  pink: { text: "text-pink-500", bg: "bg-pink-500", label: "Rosa" },
  violet: { text: "text-violet-500", bg: "bg-violet-500", label: "Violeta" },
};

export const DEFAULT_AREAS: {
  name: string;
  color: AreaColor;
  icon: AreaIcon;
}[] = [
  { name: "Trabalho", color: "blue", icon: "briefcase" },
  { name: "Pesquisa", color: "teal", icon: "flask-conical" },
  { name: "Mestrado", color: "violet", icon: "graduation-cap" },
  { name: "Pessoal", color: "amber", icon: "house" },
];
