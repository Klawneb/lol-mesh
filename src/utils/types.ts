import { Match, Prisma } from "@prisma/client";
import { PrimitiveAtom } from "jotai";

export interface Summoner {
  nameInput: string;
  summonerName: string;
  puuid: string;
  summonerFilter: PrimitiveAtom<string>;
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
