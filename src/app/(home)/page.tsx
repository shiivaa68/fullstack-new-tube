import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image src="/Youtube_logo.png" alt="LOGO" height={50} width={50} />
      <p className="text-xl font-semibold tracking-tight">New Tube</p>
    </div>
  );
}
