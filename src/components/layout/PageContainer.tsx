
import AppHeader from "./AppHeader";
import UserMenu from "@/components/auth/UserMenu";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

const PageContainer = ({ title, children, showBackButton = false }: PageContainerProps) => {
  return (
    <div className="max-w-md mx-auto min-h-screen h-full pb-24 relative">
      <div className="sticky top-0 z-50 backdrop-blur-sm border-b border-white/20 bg-white/20">
        <div className="px-4 py-3 flex justify-between items-center">
          <AppHeader title={title} showBackButton={showBackButton} />
          <UserMenu />
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
