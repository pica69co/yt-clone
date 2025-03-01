import { trpc } from "@/trpc/client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { DEFAULT_LIMIT } from "@/constants";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { toast } from "sonner";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export const PlaylistAddModal = ({
  open,
  onOpenChange,
  videoId,
}: PlaylistAddModalProps) => {
  const utils = trpc.useUtils();
  const {
    data: playlists,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = trpc.playLists.getManyForVideo.useInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && open, // Only fetch when the modal is open
    }
  );
  const addVideo = trpc.playLists.addVideo.useMutation({
    onSuccess: () => {
      toast.success("Video added to playlist");
      utils.playLists.getMany.invalidate();
      utils.playLists.getManyForVideo.invalidate({ videoId });
      //TODO: Invalidate playlist.getOne
    },
    onError: () => {
      toast.error("Error adding video to playlist");
    },
  });

  const removeVideo = trpc.playLists.removeVideo.useMutation({
    onSuccess: () => {
      toast.success("Video removed from playlist");
      utils.playLists.getMany.invalidate();
      utils.playLists.getManyForVideo.invalidate({ videoId });
      //TODO: Invalidate playlist.getOne
    },
    onError: () => {
      toast.error("Error removing video from playlist");
    },
  });

  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div>
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />{" "}
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant={"ghost"}
                className="w-full justify-start px-2 [&__svg]:size-5"
                size="lg"
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeVideo.mutate({ videoId, playlistId: playlist.id });
                  } else {
                    addVideo.mutate({ videoId, playlistId: playlist.id });
                  }
                }}
                disabled={addVideo.isPending || removeVideo.isPending}
              >
                {playlist.containsVideo ? (
                  <SquareCheckIcon className="mr-2" />
                ) : (
                  <SquareIcon className="mr-2" />
                )}
                {playlist.name}
              </Button>
            ))}
        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isManual
          />
        )}
      </div>
    </ResponsiveModal>
  );
};
