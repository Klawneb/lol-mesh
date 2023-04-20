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

export type ChampionComboRow = {
  summoner1Champion: string;
  summoner2Champion: string;
  totalGames: number;
  totalWins: number;
  winrate: number;
  score: number;
};
