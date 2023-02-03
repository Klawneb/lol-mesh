import { Participant } from "@prisma/client";
import { LolApi } from "twisted";
import { RegionGroups, Regions } from "twisted/dist/constants/regions.js";
import { z } from "zod";
import { env } from "../../../env/server.mjs";

import { createTRPCRouter, publicProcedure } from "../trpc";

const twisted = new LolApi({
  key: env.RIOT_API_KEY,
});

let currentlyProcessing = false;

export const riotRouter = createTRPCRouter({
  getSummoner: publicProcedure
    .input(
      z.object({
        summonerName: z.string(),
        region: z.nativeEnum(Regions),
      })
    )
    .query(async ({ input }) => {
      const summoner = await twisted.Summoner.getByName(input.summonerName, input.region);
      return summoner;
    }),
  getMatchHistory: publicProcedure
    .input(
      z.object({
        summonerUUID: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.summonerUUID) {
        return [] as Participant[];
      }
      const matchHistory = await ctx.prisma.participant.findMany({
        where: {
          uuid: input.summonerUUID,
        },
      });
      return matchHistory;
    }),
  updateMatchHistory: publicProcedure
    .input(
      z.object({
        uuid: z.string(),
        regionGroup: z.nativeEnum(RegionGroups),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const matches = await twisted.MatchV5.list(input.uuid, input.regionGroup);
      const unprocessed: string[] = [];
      for (const matchID of matches.response) {
        if (!(await ctx.prisma.match.findUnique({ where: { id: matchID } }))) {
          await ctx.prisma.unprocessedMatches.upsert({
            create: {
              id: matchID,
            },
            update: {},
            where: {
              id: matchID,
            },
          });
          unprocessed.push(matchID);
        }
      }
      if (!currentlyProcessing) {
        currentlyProcessing = true;
        while (await ctx.prisma.unprocessedMatches.findFirst()) {
          const matchID = (await ctx.prisma.unprocessedMatches.findFirst())?.id;
          if (matchID) {
            const match = await twisted.MatchV5.get(matchID, input.regionGroup);
            if (!(await ctx.prisma.match.findUnique({ where: { id: matchID } }))) {
              await ctx.prisma.match.create({
                data: {
                  id: matchID,
                  startTime: new Date(match.response.info.gameStartTimestamp),
                },
              });
              for (const participant of match.response.info.participants) {
                await ctx.prisma.participant.create({
                  data: {
                    assists: participant.assists,
                    champion: participant.championName,
                    deaths: participant.deaths,
                    kills: participant.kills,
                    uuid: participant.puuid,
                    win: participant.win,
                    matchId: matchID,
                  },
                });
                await new Promise((r) => setTimeout(r, 1500));
              }
              await ctx.prisma.unprocessedMatches.delete({
                where: {
                  id: matchID,
                },
              });
            }
          }
        }
        currentlyProcessing = false;
      }
      return unprocessed;
    }),
});
