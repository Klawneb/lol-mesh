import { Participant } from "@prisma/client";
import { ChampionStats, MatchWithParticipants, Summoner } from "../../utils/types";
import ChampionPoolDisplay from "./ChampionPoolDisplay";
import { summoner1FilterAtom, summoner2FilterAtom } from "../../utils/atoms";
import { ComboWinrates } from "./ComboWinrates";

interface ChampionComboStatsProps {
  commonMatches: MatchWithParticipants[];
  summoner1: Summoner;
  summoner2: Summoner;
}

function getChampionStats(participations: Participant[]) {
  const champStats = new Map<string, ChampionStats>();

  participations.forEach((participation) => {
    if (champStats.has(participation.champion)) {
      const stats = champStats.get(participation.champion) as ChampionStats;
      champStats.set(participation.champion, {
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + (participation.win ? 1 : 0),
        winrate: (stats.gamesWon + (participation.win ? 1 : 0) / participations.length) * 100,
      });
    } else {
      champStats.set(participation.champion, {
        gamesPlayed: 1,
        gamesWon: participation.win ? 1 : 0,
        winrate: participation.win ? 100 : 0,
      });
    }
  });

  return champStats;
}

export default function ChampionComboStats({ commonMatches, summoner1, summoner2 }: ChampionComboStatsProps) {
  const summoner1Participations = commonMatches.map((match) => match.participants.find((participant) => participant.uuid === summoner1.puuid)) as Participant[];
  const summoner2Participations = commonMatches.map((match) => match.participants.find((participant) => participant.uuid === summoner2.puuid)) as Participant[];
  const summoner1ChampStats = getChampionStats(summoner1Participations);
  const summoner2ChampStats = getChampionStats(summoner2Participations);

  return (
    <div className="w-full flex flex-col flex-grow my-3 rounded-xl">
      <div className="w-full flex h-full justify-around">
        <ChampionPoolDisplay championStats={summoner1ChampStats} summoner={summoner1} />
        <ComboWinrates commonMatches={commonMatches} summoner1={summoner1} summoner2={summoner2} />
        <ChampionPoolDisplay championStats={summoner2ChampStats} summoner={summoner2} />
      </div>
    </div>
  );
}
