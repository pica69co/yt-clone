import { HydrateClient, trpc } from "@/trpc/server";
import { VideoView } from "@/modules/videos/ui/views/video-view";
interface PageParams {
  params: Promise<{
    videoId: string;
  }>;
}

const page = async ({ params }: PageParams) => {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({ id: videoId });
  // TODO: change to 'prefetchInfinite' when implemented
  void trpc.comments.getMany.prefetch({ videoId: videoId });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default page;
