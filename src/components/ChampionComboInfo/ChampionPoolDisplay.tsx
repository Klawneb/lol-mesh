import { PrimitiveAtom, useAtom } from "jotai";
import { ChampionStats, Summoner } from "../../utils/types";

interface ChampionPoolDisplayProps {
  championStats: Map<string, ChampionStats>;
  summoner: Summoner;
}

function translateFilter(filter: string) {
  if (filter === "ANY") {
    return "";
  }
  if (filter === "TOP") {
    return "top";
  }
  if (filter === "JUNGLE") {
    return "jungle";
  }
  if (filter === "MIDDLE") {
    return "mid";
  }
  if (filter === "BOTTOM") {
    return "bot";
  }
  if (filter === "UTILITY") {
    return "support";
  }
  return "";
}

export default function ChampionPoolDisplay({ championStats, summoner }: ChampionPoolDisplayProps) {
  const summoner1MaxPlayed = Math.max(...Array.from(championStats.values()).map((c) => c.gamesPlayed));
  const [filter, setFilter] = useAtom(summoner.summonerFilter);

  return (
    <div className="flex flex-col bg-base-100 h-full p-3 w-1/4 rounded-lg">
      <p className="text-center">{`${summoner.summonerName}'s ${translateFilter(filter)}`} champion pool</p>
      <div className="flex-grow h-0 rounded-lg overflow-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary">
        {Array.from(championStats.entries())
          .sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed)
          .map(([champName, stats], index) => {
            return (
              <div key={champName} className={`flex flex-col w-full p-1 mb-1 ${index % 2 === 0 ? "bg-base-200" : ""}`}>
                <div className="flex w-full">
                  <div className="w-full flex justify-between">
                    <p>{champName}</p>
                    <p>
                      {stats.gamesPlayed} {stats.gamesPlayed === 1 ? "game" : "games"}
                    </p>
                  </div>
                  <div className="w-3" />
                </div>
                <div className="flex w-full">
                  <div className="bg-secondary-focus h-1" style={{ width: `${(stats.gamesPlayed / summoner1MaxPlayed) * 100}%` }} />
                  <div className="w-3" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
