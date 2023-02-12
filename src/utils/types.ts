import { Match, Prisma } from "@prisma/client";

export interface Summoner {
  name: string;
  matchHistory: MatchWithParticipants[];
}

export type MatchWithParticipants = Prisma.MatchGetPayload<{
  include: {
    participants: true;
  };
}>;
