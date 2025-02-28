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

export const LikedVideosSection = () => {
  return (
    <Suspense fallback={<LikedVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <LikedVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const LikedVideosSectionSkeleton = () => {
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

const LikedVideosSectionSuspense = () => {
  const [videos, query] = trpc.playLists.getLiked.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" />
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
