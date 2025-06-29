
import AppHeader from "./AppHeader";
import UserMenu from "@/components/auth/UserMenu";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

const PageContainer = ({
  title,
  children,
  showBackButton = false
}: PageContainerProps) => {
  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      {/* Mobile container with frame effect */}
      <div className="w-full max-w-md mx-auto min-h-screen relative bg-white shadow-2xl">
        {/* Sticky header */}
        <div className="sticky top-0 z-50 backdrop-blur-sm border-b border-white/20 bg-white/20">
          <div className="flex justify-between items-center px-[20px] py-[10px]">
            <AppHeader title={title} showBackButton={showBackButton} />
            <UserMenu />
          </div>
        </div>
        
        {/* Content with mobile padding and bottom navbar space */}
        <div className="p-6 px-[20px] pb-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
