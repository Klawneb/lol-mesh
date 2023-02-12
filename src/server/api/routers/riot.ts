import { Participant, Prisma } from "@prisma/client";
import PQueue from "p-queue";
import { LolApi } from "twisted";
import { RegionGroups, Regions } from "twisted/dist/constants/regions.js";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import type { ParticipantWithMatch } from "../../../utils/types.js";
import { createTRPCRouter, publicProcedure } from "../trpc";

const twisted = new LolApi({
  key: env.RIOT_API_KEY,
});

const queue = new PQueue({
  concurrency: 1,
  interval: 1500,
  intervalCap: 1,
});

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
        return [] as ParticipantWithMatch[];
      }
      const matchHistory = await ctx.prisma.participant.findMany({
        where: {
          uuid: input.summonerUUID,
        },
        include: {
          Match: true,
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
        unprocessed.push(matchID);
        if (!(await ctx.prisma.match.findUnique({ where: { id: matchID } }))) {
          await queue.add(async () => {
            const match = await twisted.MatchV5.get(matchID, input.regionGroup);
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
            }
          });
        }
      }
      return unprocessed;
    }),
});
