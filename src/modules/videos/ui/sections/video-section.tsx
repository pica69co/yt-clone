"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoPlayer } from "../components/video-player";
import { VideoBanner } from "../components/video-banner";
import { VideoTopRow } from "../components/video-top-row";
interface VideoSectionProps {
  videoId: string;
}

export const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<p>Loading video...</p>}>
      <ErrorBoundary fallback={<p>Failed to load video</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  if (!video) {
    return null;
  }

  if (!video.muxPlaybackId) {
    return <div>Video not ready</div>;
  }

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={() => {}}
          playbackId={video.muxPlaybackId!}
          thumbnailUrl={video.thumbnailUrl!}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};
