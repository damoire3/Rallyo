import Link from "next/link";
import { Icon } from "./icon";
import { CategoryBadge, Dashes, Notch, ProgressBar } from "./ui";
import { fmt, type Cagnotte, type EventItem } from "@/lib/data";

type Props =
  | { kind: "cagnotte"; item: Cagnotte }
  | { kind: "event"; item: EventItem };

export function StubCard(props: Props) {
  const { item } = props;
  const isCagnotte = props.kind === "cagnotte";
  const href = isCagnotte ? `/cagnottes/${item.id}` : `/evenements/${item.id}`;

  return (
    <Link
      href={href}
      className="relative block w-full shrink-0 overflow-hidden rounded-[22px] border border-line bg-card text-left"
    >
      <div
        className="relative flex h-24 items-end p-3"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(10,10,15,0.75), rgba(10,10,15,0.05)), url(${item.image}), ${item.gradient}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <CategoryBadge>{item.cat}</CategoryBadge>
        {props.kind === "cagnotte" && (
          <span className="absolute right-3 top-3 rounded-full bg-bg/55 px-2 py-1 text-[10px] font-bold text-white">
            J-{props.item.days}
          </span>
        )}
      </div>
      <Notch side="left" />
      <Notch side="right" />

      <div className="px-4 pb-2 pt-3">
        <p className="text-[14px] font-semibold leading-snug text-white">{item.title}</p>
        {props.kind === "cagnotte" ? (
          <>
            <p className="mt-0.5 text-[11px] text-muted">{props.item.org}</p>
            <div className="mt-2.5">
              <ProgressBar pct={Math.round((props.item.raised / props.item.goal) * 100)} />
              <div className="mt-1.5 flex justify-between">
                <span className="text-[11px] font-bold text-cyan">{fmt(props.item.raised)}</span>
                <span className="text-[11px] text-faint">
                  {Math.round((props.item.raised / props.item.goal) * 100)}%
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-1 flex items-center gap-1">
              <Icon name="mapPin" size={11} color="#4E4A5E" />
              <span className="text-[11px] text-muted">{props.item.place}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1">
              <Icon name="calendar" size={11} color="#4E4A5E" />
              <span className="text-[11px] text-muted">
                {props.item.date} · {props.item.time}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="px-4">
        <Dashes />
      </div>
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-[11px] text-muted">
          {props.kind === "cagnotte"
            ? `${props.item.supporters} soutiens`
            : `${props.item.left} billets restants`}
        </span>
        <span className="font-mono text-[12px] font-bold text-ink">
          {props.kind === "cagnotte" ? "VOIR →" : fmt(props.item.price)}
        </span>
      </div>
    </Link>
  );
}
