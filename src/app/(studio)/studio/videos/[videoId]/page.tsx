import { VideoView } from "@/modules/studio/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic"; // force-dynamic is used to force dynamic import

interface VideoDetailPageProps {
  params: Promise<{ videoId: string }>;
}

const VideoDetailPage = async ({ params }: VideoDetailPageProps) => {
  const { videoId } = await params;
  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />{" "}
    </HydrateClient>
  );
};

export default VideoDetailPage;
