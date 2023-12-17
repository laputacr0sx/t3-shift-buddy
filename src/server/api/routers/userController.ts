import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { userPrivateMetadataSchema } from "~/utils/zodSchemas";

export const userControllerRouter = createTRPCRouter({
  setUserMetadata: protectedProcedure
    .input(userPrivateMetadataSchema)
    .query(({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      const user = ctx.user;
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User Not Found" });
      }

      return clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          staffId: input.staffId,
          row: input.row,
        },
      });
    }),
});
