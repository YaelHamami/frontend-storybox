import { ReactNode } from "react";

interface BaseContainerProps {
  children: ReactNode;
  className?: string; // Allow className prop
}

const BaseContainer = ({ children , className}: BaseContainerProps) => {
  return (
    <div className={`base-container ${className || ""}`} style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      {children}
    </div>
  );
};


export default BaseContainer;
