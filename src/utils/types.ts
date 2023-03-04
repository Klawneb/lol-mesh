import { Match, Prisma } from "@prisma/client";

export interface Summoner {
  name: string;
  matchHistory: MatchWithParticipants[];
  puuid: string;
}

export type MatchWithParticipants = Prisma.MatchGetPayload<{
  include: {
    participants: true;
  };
}>;
