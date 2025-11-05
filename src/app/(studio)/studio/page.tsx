import { StudioView } from "@/modules/studio/ui/view/studio-view";
import { HydrateClient } from "@/trpc/server";
// import { DEFAULT_LIMIT } from "@/constants";

const Page = async () => {
  // void trpc.studio.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
  //ino comment kon
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Page;
