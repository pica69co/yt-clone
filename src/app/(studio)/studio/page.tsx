import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

import { StudioView } from "@/modules/studio/ui/views/studio-view";

export const dynamic = "force-dynamic";

const StudioPage = async () => {
  //  use useSuspenseInfiniteQuery when you use prefetchInfinite();
  //  example: here and videos-section.tsx in studio module
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <StudioView />{" "}
    </HydrateClient>
  );
};

export default StudioPage;
