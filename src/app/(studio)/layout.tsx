import { StudioLayOut } from "@/modules/studio/ui/layouts/studio-layout";

interface LayOutProps {
  children: React.ReactNode;
}

const LayOut = ({ children }: LayOutProps) => {
  return <StudioLayOut>{children}</StudioLayOut>;
};

export default LayOut;
