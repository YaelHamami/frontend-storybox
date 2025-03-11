import { ReactNode } from "react";

interface BaseContainerProps {
  children: ReactNode;
}

const BaseContainer = ({ children }: BaseContainerProps) => {
  return (
    <div className="container mt-4" style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      {children}
    </div>
  );
};

export default BaseContainer;
