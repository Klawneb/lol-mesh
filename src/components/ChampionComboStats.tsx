import { Participant } from "@prisma/client";
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
  const summoner1Participations = commonMatches.map((match) => match.participants.find((participant) => participant.uuid === summoner1.puuid)) as Participant[];

  const summoner1ChampPool = [...new Set(summoner1Participations.flatMap((p) => (p ? p.champion : [])))];

  console.log(summoner1Participations);

  return (
    <div className="w-full flex flex-col flex-grow my-3 rounded-xl">
      <div className="w-full flex h-full">
        <div className="flex flex-col bg-base-100 h-full p-3 w-1/5">
          <p className="text-center">{summoner1.name} champs</p>
          <select className="select select-bordered bg-base-200">
            {summoner1ChampPool.sort().map((champName) => {
              return (
                <option key={champName} value={champName}>
                  {champName}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}
