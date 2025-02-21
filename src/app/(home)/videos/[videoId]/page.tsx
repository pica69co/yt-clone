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

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default page;
