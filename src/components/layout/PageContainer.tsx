
import AppHeader from "./AppHeader";
import UserMenu from "@/components/auth/UserMenu";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
}

const PageContainer = ({ title, children }: PageContainerProps) => {
  return (
    <div className="max-w-screen-md mx-auto bg-white min-h-screen h-full pb-24">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-4 flex justify-between items-center">
          <AppHeader title={title} />
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
