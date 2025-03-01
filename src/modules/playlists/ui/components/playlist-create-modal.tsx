import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const PlaylistCreateModal = ({
  open,
  onOpenChange,
}: PlaylistCreateModalProps) => {
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const generatePlaylist = trpc.playLists.create.useMutation({
    onSuccess: () => {
      utils.playLists.getMany.invalidate();
      toast.success("Playlist created!");
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Something went wrong...");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generatePlaylist.mutate(values);
  };

  return (
    <ResponsiveModal
      title="create a playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Playlist Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="playlist name" />
                  <FormMessage />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex">
            <Button
              className=""
              type="submit"
              disabled={generatePlaylist.isPending}
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
