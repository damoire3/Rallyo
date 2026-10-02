import {
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  CirclePlus,
  HandCoins,
  Heart,
  House,
  MapPin,
  Music,
  PartyPopper,
  QrCode,
  Search,
  Share2,
  Sparkles,
  Ticket,
  Trophy,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

/** Icônes de l'appli : Lucide (bibliothèque professionnelle). Même API qu'avant, les écrans n'ont pas changé. */
const ICONS = {
  home: House,
  search: Search,
  plusCircle: CirclePlus,
  ticket: Ticket,
  user: User,
  arrowLeft: ArrowLeft,
  heart: Heart,
  share: Share2,
  mapPin: MapPin,
  calendar: Calendar,
  users: Users,
  chevronRight: ChevronRight,
  qrCode: QrCode,
  sparkles: Sparkles,
  check: Check,
  x: X,
  camera: Camera,
  music: Music,
  partyPopper: PartyPopper,
  trophy: Trophy,
  handCoins: HandCoins,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export function Icon({ name, size = 20, color = "currentColor", strokeWidth = 2, className }: Props) {
  const Cmp = ICONS[name];
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} className={className} aria-hidden />;
}
