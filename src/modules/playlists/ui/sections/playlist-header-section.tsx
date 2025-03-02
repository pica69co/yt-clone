"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

export const PlaylistHeaderSection = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-32" />
    </div>
  );
};

const PlaylistHeaderSectionSuspense = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  const [playlist] = trpc.playLists.getOne.useSuspenseQuery({
    id: playlistId,
  });
  const router = useRouter();
  const utils = trpc.useUtils();
  const remove = trpc.playLists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist removed");
      utils.playLists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: () => {
      toast.error("Failed to remove playlist, Try again...");
    },
  });
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name || "Playlist"}</h1>
        <p className="text-xs text-muted-foreground">Videos from playlist</p>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => remove.mutate({ id: playlistId })}
        disabled={remove.isPending}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
};
