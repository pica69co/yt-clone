"use client";

import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { toast } from "sonner";

interface VideosSectionProps {
  playlistId: string;
}
export const VideosSection = (props: VideosSectionProps) => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <VideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {[...Array(18)].map((_, i) => (
          <VideoGridCardSkeleton key={i} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {[...Array(18)].map((_, i) => (
          <VideoRowCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
};

const VideosSectionSuspense = ({ playlistId }: VideosSectionProps) => {
  const utils = trpc.useUtils();

  const [videos, query] = trpc.playLists.getVideos.useSuspenseInfiniteQuery(
    {
      playlistId,
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const removeVideo = trpc.playLists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist");
      utils.playLists.getMany.invalidate();
      utils.playLists.getManyForVideo.invalidate({ videoId: data.videoId });
      utils.playLists.getOne.invalidate({ id: data.playlistId });
      utils.playLists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              key={video.id}
              data={video}
              size="compact"
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
