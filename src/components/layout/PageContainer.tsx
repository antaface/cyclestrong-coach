
import { ReactNode } from "react";
import AppHeader from "./AppHeader";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  headerRight?: ReactNode;
  noPadding?: boolean;
}

const PageContainer = ({
  children,
  title,
  showBackButton = false,
  headerRight,
  noPadding = false
}: PageContainerProps) => {
  return (
    <div className="app-container">
      {title && (
        <AppHeader 
          title={title} 
          showBackButton={showBackButton} 
          rightContent={headerRight} 
        />
      )}
      <div className={noPadding ? "" : "page-container"}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
