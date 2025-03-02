import React from "react";
import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import VideosView from "@/modules/playlists/ui/views/playlist-video-view";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;
  // console.log(playlistId);
  void trpc.playLists.getOne.prefetch({ id: playlistId });
  void trpc.playLists.getVideos.prefetchInfinite({
    playlistId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <VideosView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default Page;
