import { PrimitiveAtom, useAtom } from "jotai";
import { ChampionStats, Summoner } from "../utils/types";

interface ChampionPoolDisplayProps {
  championStats: Map<string, ChampionStats>;
	summonerInfo: Summoner;
}

export default function ChampionPoolDisplay({ championStats, summonerInfo }: ChampionPoolDisplayProps) {
  const summoner1MaxPlayed = Math.max(...Array.from(championStats.values()).map((c) => c.gamesPlayed));

  return (
    <div className="flex flex-col bg-base-100 h-full p-3 w-1/5 rounded-lg">
      <p className="text-center">{summonerInfo.name} champion pool</p>
      <div className="flex-grow h-0 overflow-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary">
        {Array.from(championStats.entries())
          .sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed)
          .map(([champName, stats]) => {
            return (
              <div key={champName} className="flex flex-col w-full mb-1">
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
                  <div className="bg-secondary h-1" style={{ width: `${(stats.gamesPlayed / summoner1MaxPlayed) * 100}%` }} />
                  <div className="w-3" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
