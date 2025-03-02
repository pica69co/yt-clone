import { trpc, HydrateClient } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
import HistoryView from "@/modules/playlists/ui/views/history-view";
export const dynamic = "force-dynamic";
const Page = async () => {
  void trpc.playLists.getHistory.prefetchInfinite({ limit: DEFAULT_LIMIT });
  return (
    <HydrateClient>
      {" "}
      <HistoryView />{" "}
    </HydrateClient>
  );
};

export default Page;
