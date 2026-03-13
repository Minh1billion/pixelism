import { Header } from "@/shared/components/layouts/Header";
import { Footer } from "@/shared/components/layouts/Footer";
import { NotificationStack } from '@/shared/components/ui/Notification'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="min-h-screen flex flex-col bg-neutral-950">
        <Header />
        <main className="flex-1">
          {children}
          <NotificationStack />
        </main>
        <Footer />
      </div>
  );
}