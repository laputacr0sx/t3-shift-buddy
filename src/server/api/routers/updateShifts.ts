// import { z } from "zod";
// import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// export const updateShiftRouter = createTRPCRouter({
//   nextWeekPrefix: publicProcedure
//     .input(z.object({ roster: z.string().array().max(7) }))
//     .mutation(async ({ input, ctx }) => {
//       try {
//         await ctx.prisma.weekPrefix.create({
//           data: input.roster,
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     }),
// });
