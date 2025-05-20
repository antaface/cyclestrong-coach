
import AppHeader from "./AppHeader";
import UserMenu from "@/components/auth/UserMenu";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

const PageContainer = ({ title, children, showBackButton = false }: PageContainerProps) => {
  return (
    <div className="max-w-screen-md mx-auto bg-background min-h-screen h-full pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/20">
        <div className="px-6 py-4 flex justify-between items-center">
          <AppHeader title={title} showBackButton={showBackButton} />
          <UserMenu />
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
