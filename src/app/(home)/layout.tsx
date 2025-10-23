import { HomeLayOut } from "@/modules/home/ui/layouts/home-layout";

interface LayOutProps {
  children: React.ReactNode;
}

const LayOut = ({ children }: LayOutProps) => {
  return <HomeLayOut>{children}</HomeLayOut>;
};

export default LayOut;
