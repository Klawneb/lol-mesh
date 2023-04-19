import { Pie } from "@nivo/pie";
import type { Participant } from "@prisma/client";
import { Summoner } from "../utils/types";

interface KdaStatsProps {
  summoner: Summoner;
  participants: (Participant | undefined)[];
}

export default function KdaStats({ participants, summoner }: KdaStatsProps) {
  const stats = participants
    .flatMap((p) => (p ? [p] : []))
    .reduce(
      (prev, curr) => {
        return {
          kills: prev.kills + curr.kills,
          deaths: prev.deaths + curr.deaths,
          assists: prev.assists + curr.assists,
        };
      },
      {
        kills: 0,
        assists: 0,
        deaths: 0,
      }
    );
  const totalGames = participants.length;

  return (
    <div className="flex bg-base-100 p-2 items-center rounded-xl h-40 justify-center">
      <div>
        <p className="text-2xl text-center">{summoner.summonerName}{"'s"} K/D/A:</p>
        <p className="text-5xl">
          {(stats.kills / totalGames).toFixed(2)} / {(stats.deaths / totalGames).toFixed(2)} / {(stats.assists / totalGames).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
