import { db } from "@/db";
import { videos } from "@/db/schema";
import { TITLE_SYSTEM_PROMPT } from "@/modules/videos/constants";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId } = input;

  // Workflow Events
  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Video not found");
    }

    return existingVideo;
  });

  // obtain video transcript from Mux
  const transcript = await context.run("get-transcript", async () => {
    const track = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;

    const response = await fetch(track);

    if (!response.ok) {
      throw new Error("Failed to fetch transcript");
    }

    return await response.text();
  });

  // Call Deepseek API to generate title
  const { body } = await context.api.openai.call("generate-title", {
    baseURL: "https://api.deepseek.com",
    token: process.env.DEEPSEEK_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: TITLE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    },
  });

  console.log("get text", body.choices[0].message.content);

  const title = body.choices[0].message.content;

  if (!title) {
    throw new Error("Failed to generate title");
  }

  // Update video title
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        title: title || video.title,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
