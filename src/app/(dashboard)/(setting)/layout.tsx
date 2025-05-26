import SettingsNavigation from "@/components/bypage/setting/navigation";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-12 py-2">
      <SettingsNavigation />
      {children}
    </main>
  );
}
