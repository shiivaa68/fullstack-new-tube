"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

export const StudioUploadModal = () => {
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("video created");
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      toast.error("sth went wrong");
    },
  });
  const utils = trpc.useUtils();
  return (
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <PlusIcon />
      )}
      Create
    </Button>
  );
};
