import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { eq, and } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `This tool generates SEO-optimized YouTube titles based on the video transcript. It follows best-practice guidelines to ensure the title is clear, searchable, and compelling. The system focuses on using relevant keywords, 
highlighting the most unique aspect of the content, and avoiding unnecessary jargon. 
Titles are crafted to be action-oriented,
 easy to understand, and optimized for discoverability. 
 Each title is kept between 3–8 words and under 100 characters,
  and is returned as plain text only.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Not found");
    }
    return existingVideo;
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = await response.text();
    if (!text) {
      throw new Error("Bad request");
    }
    return text;
  });

  const { body } = await context.api.openai.call("generate-description", {
    token: process.env.OPENAI_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: DESCRIPTION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    },
  });

  const description = body.choices[0]?.message.content;
  if (!description) {
    throw new Error("bad request");
  }
  await context.run("update-step", async () => {
    await db
      .update(videos)
      .set({
        description: description || video.description,
      })
      .where(and(eq(videos.id, videoId), eq(videos.userId, video.userId)));
  });
});
