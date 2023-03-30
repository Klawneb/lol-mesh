import { Match, Prisma } from "@prisma/client";

export interface Summoner {
  name: string;
  puuid: string;
}

export interface ChampionStats {
  gamesPlayed: number;
  gamesWon: number;
  winrate: number;
}

export type MatchWithParticipants = Prisma.MatchGetPayload<{
  include: {
    participants: true;
  };
}>;
