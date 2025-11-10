import { eq } from "drizzle-orm";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
// import { headers } from "next/headers";
import { mux } from "@/lib/mux";
import { videos } from "@/db/schema";
import { db } from "@/db";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent;

export const POST = async (request: Request) => {
  if (!SIGNING_SECRET) {
    throw new Error("MUX_WEBHOOK_SECRET_ is not set");
  }

  // const headerPlayload = await headers();
  // const muxSignature = headerPlayload.get("mux-signature");
  const muxSignature = request.headers.get("mux-signature");

  if (!muxSignature) {
    return new Response("No signature found", { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  if (process.env.NODE_ENV === "development") {
    console.log("Skipping verification");
  } else {
    mux.webhooks.verifySignature(
      body,
      { mux_signature: muxSignature },
      SIGNING_SECRET
    );
  }

  // mux.webhooks.verifySignature(
  //   body,
  //   {
  //     mux_signature: muxSignature,
  //   },
  //   SIGNING_SECRET
  // );
  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
      if (!data.upload_id) {
        return new Response("No upload ID found", { status: 400 });
      }
      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.id,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
  }
  return new Response("webhook recieved", { status: 200 });
};
