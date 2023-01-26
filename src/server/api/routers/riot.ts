import { LolApi } from "twisted";
import { Regions } from "twisted/dist/constants/regions.js";
import { z } from "zod";
import { env } from "../../../env/server.mjs";

import { createTRPCRouter, publicProcedure } from "../trpc";

const twisted = new LolApi({
  key: env.RIOT_API_KEY,
  
});

export const riotRouter = createTRPCRouter({
  getSummoner: publicProcedure
    .input(
      z.object({
        summonerName: z.string(),
        region: z.nativeEnum(Regions)
      })
    )
    .query(async ({ input }) => {
      const summoner = await twisted.Summoner.getByName(input.summonerName, input.region);
      return summoner;
    }),
});
