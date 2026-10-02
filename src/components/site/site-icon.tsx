import {
  BadgeCheck,
  ChartColumn,
  EyeOff,
  Flag,
  Globe,
  GraduationCap,
  Handshake,
  LockKeyhole,
  Mic,
  QrCode,
  ReceiptText,
  Smartphone,
  Sparkles,
  Ticket,
  TicketCheck,
  TrendingDown,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Icônes de la landing (Lucide). Les données (site-data.ts) référencent ces clés, plus d'emojis. */
const ICONS: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  zap: Zap,
  "eye-off": EyeOff,
  "qr-code": QrCode,
  lock: LockKeyhole,
  "badge-check": BadgeCheck,
  chart: ChartColumn,
  flag: Flag,
  "ticket-check": TicketCheck,
  ticket: Ticket,
  family: UsersRound,
  handshake: Handshake,
  mic: Mic,
  graduation: GraduationCap,
  receipt: ReceiptText,
  "trend-down": TrendingDown,
  globe: Globe,
};

export function SiteIcon({ name, size = 26 }: { name: string; size?: number }) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp size={size} strokeWidth={1.75} aria-hidden />;
}
