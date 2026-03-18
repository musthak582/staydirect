import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  hotelLogo: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      
      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("Unauthorized");
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", (file as any).ufsUrl ?? file.url);
      
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
    
  hotelCover: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      
      if (!session?.user) throw new UploadThingError("Unauthorized");
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Cover upload complete for userId:", metadata.userId);
      console.log("file url", (file as any).ufsUrl ?? file.url);
      return { uploadedBy: metadata.userId };
    }),
    
  roomImages: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      
      if (!session?.user) throw new UploadThingError("Unauthorized");
      
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Room images upload complete for userId:", metadata.userId);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;