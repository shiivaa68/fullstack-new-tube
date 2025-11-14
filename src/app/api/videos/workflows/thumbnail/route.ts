// app/api/videos/workflows/thumbnail/route.ts
import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { UTApi } from "uploadthing/server"; // you have used this earlier

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    if (!existingVideo) throw new Error("Video not found");
    return existingVideo;
  });

  if (!video.muxPlaybackId) throw new Error("No playback id");

  // simple option: use mux thumbnail
  const thumbnailUrl = `https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg`;

  // upload to UploadThing / UTApi
  const utapi = new UTApi();
  const uploaded = await utapi.uploadFilesFromUrl(thumbnailUrl);

  if (!uploaded?.data) throw new Error("Upload failed");

  const { key: thumbnailKey, url: uploadedUrl } = uploaded.data;

  await context.run("update-thumbnail", async () => {
    await db
      .update(videos)
      .set({ thumbnailUrl: uploadedUrl, thumbnailKey })
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
  });

  // return { ok: true, thumbnailUrl: uploadedUrl };
});
