import { MatchWithParticipants, Summoner } from "../utils/types";

interface ChampionComboStatsProps {
  commonMatches: MatchWithParticipants[];
  summoner1: Summoner;
  summoner2: Summoner;
}

interface ChampionCombo {
  gamesPlayed: number;
  gamesWon: number;
  winrate: number;
}

export default function ChampionComboStats({ commonMatches, summoner1, summoner2 }: ChampionComboStatsProps) {
  const championPairings = new Map<string, ChampionCombo>();
  const summoner1ChampPool: string[] = [];
  const summoner2ChampPool: string[] = [];

  for (const match of commonMatches) {
    const summoner1Participation = match.participants.find((participant) => participant.uuid === summoner1.puuid);
    const summoner2Participation = match.participants.find((participant) => participant.uuid === summoner2.puuid);

    if (summoner1Participation && summoner2Participation) {
      summoner1ChampPool.push(summoner1Participation.champion);
      summoner2ChampPool.push(summoner2Participation.champion);
      const champCombo = `${summoner1Participation.champion},${summoner2Participation.champion}`;
      const existingStats = championPairings.get(champCombo);
      if (existingStats) {
        const gamesPlayed = existingStats.gamesPlayed + 1;
        const gamesWon = existingStats.gamesWon + (summoner1Participation.win ? 1 : 0);
        const winrate = (gamesWon / gamesPlayed) * 100;
        championPairings.set(champCombo, {
          gamesPlayed,
          gamesWon,
          winrate,
        });
      } else {
        championPairings.set(champCombo, {
          gamesPlayed: 1,
          gamesWon: summoner1Participation.win ? 1 : 0,
          winrate: summoner1Participation.win ? 100 : 0,
        });
      }
    }
  }

  const sortedByWinrate = Array.from(championPairings.entries()).sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed);

  return (
    <div className="w-full">
      {sortedByWinrate.map(([names, stats]) => {
        return <p key={names}></p>;
      })}
    </div>
  );
}
