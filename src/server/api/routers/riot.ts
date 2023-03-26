import { Match, Participant, Prisma, PrismaClient } from "@prisma/client";
import { LolApi } from "twisted";
import Queue from "better-queue";
import { RegionGroups, Regions } from "twisted/dist/constants/regions.js";
import { ApiResponseDTO, MatchDto, MatchV5DTOs } from "twisted/dist/models-dto/index.js";
import { MatchQueryV5DTO } from "twisted/dist/models-dto/matches/query-v5/match-query-v5.dto.js";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { MatchWithParticipants } from "../../../utils/types.js";
import { createTRPCRouter, publicProcedure } from "../trpc";

interface queueObject {
  id: string;
  region: RegionGroups;
  prisma: PrismaClient;
}

const twisted = new LolApi({
  key: env.RIOT_API_KEY,
});

const queue = new Queue(
  (input: queueObject, cb) => {
    void addMatchID(input.id, input.region, input.prisma);
    cb();
  },
  {
    afterProcessDelay: 1500,
  }
);

async function addMatchID(matchID: string, region: RegionGroups, prisma: PrismaClient) {
  const match = await twisted.MatchV5.get(matchID, region);
  await prisma.match.create({
    data: {
      id: matchID,
      startTime: new Date(match.response.info.gameStartTimestamp),
      matchLength: match.response.info.gameDuration,
    },
  });
  for (const participant of match.response.info.participants) {
    await prisma.participant.create({
      data: {
        assists: participant.assists,
        champion: participant.championName,
        deaths: participant.deaths,
        kills: participant.kills,
        uuid: participant.puuid,
        win: participant.win,
        teamID: participant.teamId,
        position: participant.teamPosition,
        surrendered: participant.gameEndedInSurrender,
        matchId: matchID,
      },
    });
  }
}

async function fetchMatchIDs(uuid: string, regionGroup: RegionGroups) {
  let matches: string[] = [];
  for (let i = 0; i < 1; i++) {
    const ids = (
      await twisted.MatchV5.list(uuid, regionGroup, {
        count: 100,
        start: i * 100,
      })
    ).response;
    matches = matches.concat(ids);
  }
  return matches;
}

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
        return [] as MatchWithParticipants[];
      }
      const matchHistory = await ctx.prisma.match.findMany({
        where: {
          participants: {
            some: {
              uuid: input.summonerUUID,
            },
          },
        },
        include: {
          participants: true,
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
      const unprocessed: string[] = [];
      const matches = await fetchMatchIDs(input.uuid, input.regionGroup);
      for (const matchID of matches) {
        if (!(await ctx.prisma.match.findUnique({ where: { id: matchID } }))) {
          unprocessed.push(matchID);
          queue.push({
            id: matchID,
            region: input.regionGroup,
            prisma: ctx.prisma,
          });
        }
      }
      return unprocessed;
    }),
  getFetchedMatches: publicProcedure
    .input(
      z.object({
        matchIDs: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      let fetched = 0;
      for (const matchID of input.matchIDs) {
        if (await ctx.prisma.match.findUnique({ where: { id: matchID } })) {
          fetched += 1;
        }
      }
      return fetched;
    }),
  getCommonMatches: publicProcedure
    .input(
      z.object({
        summoner1puuid: z.string(),
        summoner2puuid: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const matches = await ctx.prisma.match.findMany({
        where: {
          AND: [{ participants: { some: { uuid: input.summoner1puuid } } }, { participants: { some: { uuid: input.summoner2puuid } } }],
        },
        include: {
          participants: true,
        },
      });
      return matches;
    }),
});
