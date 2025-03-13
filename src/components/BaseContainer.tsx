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


// interface BaseContainerProps {
//   children: React.ReactNode;
//   className?: string; // Allow className prop
// }

// const BaseContainer: React.FC<BaseContainerProps> = ({ children, className }) => {
//   return <div className={`base-container ${className || ""}`}>{children}</div>;
// };


export default BaseContainer;
