import { Participant } from "@prisma/client";
import { ChampionComboRow, MatchWithParticipants, Summoner } from "../../utils/types";
import { wilsonScore } from "../../utils/wilsonScore";
import { ChampionComboTable } from "./ChampionComboTable";

interface ComboWinratesProps {
  commonMatches: MatchWithParticipants[];
  summoner1: Summoner;
  summoner2: Summoner;
}

interface ChampionCombo {
  totalWins: number;
  totalGames: number;
  winrate: number;
}

function getComboWinrates(matches: MatchWithParticipants[], summoner1uuid: string, summoner2uuid: string) {
  const combos = new Map<string, ChampionCombo>();
  matches.forEach((match) => {
    const summoner1Participation = match.participants.find((p) => p.uuid === summoner1uuid) as Participant;
    const summoner2Participation = match.participants.find((p) => p.uuid === summoner2uuid) as Participant;
    const combo = `${summoner1Participation.champion},${summoner2Participation.champion}`;
    const existing = combos.get(combo);
    if (existing) {
      combos.set(combo, {
        totalGames: existing.totalGames + 1,
        totalWins: summoner1Participation.win ? existing.totalWins + 1 : existing.totalWins,
        winrate: summoner1Participation.win ? ((existing.totalWins + 1) / (existing.totalGames + 1)) * 100 : (existing.totalWins / (existing.totalGames + 1)) * 100,
      });
    } else {
      combos.set(combo, {
        totalGames: 1,
        totalWins: summoner1Participation.win ? 1 : 0,
        winrate: summoner1Participation.win ? 100 : 0,
      });
    }
  });
  return combos;
}

export function ComboWinrates({ commonMatches, summoner1, summoner2 }: ComboWinratesProps) {
  const championCombos = getComboWinrates(commonMatches, summoner1.puuid, summoner2.puuid);
  const tableData = Array.from(championCombos.entries()).map(([combo, stats]) => {
    const [summoner1Champion, summoner2Champion] = combo.split(",");
    return {
      summoner1Champion: summoner1Champion ?? "",
      summoner2Champion: summoner2Champion ?? "",
      totalGames: stats.totalGames,
      totalWins: stats.totalWins,
      winrate: Number(stats.winrate.toFixed(2)),
      score: Number((wilsonScore(stats.totalWins, stats.totalGames).left * 100).toFixed(2)),
    } as ChampionComboRow;
  });

  return (
    <div className="flex flex-col bg-base-100 mx-3 p-3 rounded-lg">
      <p className="text-center">Champion Combo Winrates</p>
      <div className="flex-grow h-0 rounded-lg overflow-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary">
        <ChampionComboTable comboData={tableData} summoner1Name={summoner1.summonerName} summoner2Name={summoner2.summonerName} />
      </div>
    </div>
  );
}
