import { DEFAULT_LIMIT } from "@/constants";
import { StudioView } from "@/modules/studio/ui/view/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

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
