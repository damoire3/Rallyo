export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</main>;
}
