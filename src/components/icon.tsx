export type IconName =
  | "home" | "search" | "plusCircle" | "ticket" | "user" | "arrowLeft" | "heart" | "share"
  | "mapPin" | "calendar" | "users" | "chevronRight" | "qrCode" | "sparkles" | "check" | "x"
  | "camera" | "music" | "partyPopper" | "trophy" | "handCoins";

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export function Icon({ name, size = 20, color = "currentColor", strokeWidth = 2, className }: Props) {
  const c = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "home": return <svg {...c}><path d="M3 11l9-8 9 8"/><path d="M9 22V12h6v10"/></svg>;
    case "search": return <svg {...c}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "plusCircle": return <svg {...c}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
    case "ticket": return <svg {...c}><path d="M3 9a2 2 0 100 6"/><path d="M21 9a2 2 0 010 6"/><rect x="3" y="6" width="18" height="12" rx="2"/><line x1="12" y1="6" x2="12" y2="18" strokeDasharray="2 3"/></svg>;
    case "user": return <svg {...c}><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0116 0v1"/></svg>;
    case "arrowLeft": return <svg {...c}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
    case "heart": return <svg {...c}><path d="M12 21s-7-4.35-9.5-8.5C.5 8 2.5 4 6.5 4c2 0 3.5 1.2 4.5 2.7C12 5.2 13.5 4 15.5 4c4 0 6 4 4 8.5C19 16.65 12 21 12 21z"/></svg>;
    case "share": return <svg {...c}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><line x1="8.2" y1="10.8" x2="15.8" y2="7.2"/><line x1="8.2" y1="13.2" x2="15.8" y2="16.8"/></svg>;
    case "mapPin": return <svg {...c}><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case "calendar": return <svg {...c}><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>;
    case "users": return <svg {...c}><circle cx="9" cy="8" r="3.2"/><path d="M3 20v-1a6 6 0 0112 0v1"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 13.2A5 5 0 0121 20v1"/></svg>;
    case "chevronRight": return <svg {...c}><polyline points="9 6 15 12 9 18"/></svg>;
    case "qrCode": return <svg {...c}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>;
    case "sparkles": return <svg {...c}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/></svg>;
    case "check": return <svg {...c}><polyline points="4 12 9 17 20 6"/></svg>;
    case "x": return <svg {...c}><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>;
    case "camera": return <svg {...c}><path d="M4 8h3l2-2h6l2 2h3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V8z"/><circle cx="12" cy="13" r="3.5"/></svg>;
    case "music": return <svg {...c}><circle cx="6" cy="18" r="2.5"/><circle cx="17" cy="16" r="2.5"/><path d="M8.5 18V5.5L19.5 4v11.5"/></svg>;
    case "partyPopper": return <svg {...c}><path d="M4 20l7-14 9 9-14 5z"/><circle cx="17" cy="6" r="1.1" fill={color}/><circle cx="20" cy="9" r="0.9" fill={color}/><circle cx="14" cy="4" r="0.9" fill={color}/></svg>;
    case "trophy": return <svg {...c}><path d="M8 4h8v4a4 4 0 01-8 0V4z"/><path d="M8 5H5a3 3 0 003 3"/><path d="M16 5h3a3 3 0 01-3 3"/><path d="M9 15h6l1 5H8l1-5z"/><line x1="12" y1="12" x2="12" y2="15"/></svg>;
    case "handCoins": return <svg {...c}><circle cx="9" cy="15" r="4"/><circle cx="15" cy="9" r="4"/></svg>;
    default: return null;
  }
}
