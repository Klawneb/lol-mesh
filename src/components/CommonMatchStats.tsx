import { Pie } from "@nivo/pie";
import { useState } from "react";
import { MatchWithParticipants, Summoner } from "../utils/types";

interface CommonMatchStatsProps {
  commonMatches: MatchWithParticipants[];
  summoner1: Summoner;
  summoner2: Summoner;
}

export default function CommonMatchStats({ commonMatches, summoner1, summoner2 }: CommonMatchStatsProps) {
  const [recentMatchLimit, setRecentMatchLimit] = useState(10);

  const summoner1Participations = commonMatches
    .sort((a, b) => b.startTime.valueOf() - a.startTime.valueOf())
    .map((match) => match.participants.find((participation) => participation.uuid === summoner1.puuid));
  const winrate = (summoner1Participations.filter((participantion) => participantion?.win).length / summoner1Participations.length) * 100;
  const recentMatchList = summoner1Participations.slice(0, recentMatchLimit);
  const recentWinrate = (recentMatchList.filter((participantion) => participantion?.win).length / recentMatchList.length) * 100;

  return (
    <div className="flex-grow bg-base-200 m-4 p-4 rounded-xl">
      {commonMatches.length > 0 ? (
        <div className="flex">
          <div className="flex bg-base-100 items-center w-1/2 justify-around p-4 m-2 rounded-xl">
            <p className="text-2xl">All Time Winrate:</p>
            <Pie
              data={[
                { id: "Loss", value: 100 - Number(winrate.toFixed(2)) },
                { id: "Win", value: winrate.toFixed(2) },
              ]}
              width={150}
              height={150}
              colors={["#a83232", "#32a852"]}
              enableArcLinkLabels={false}
              isInteractive={true}
              activeOuterRadiusOffset={4}
              arcLabel={(label) => `${label.value}%`}
              margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
            />
          </div>
          <div className="flex bg-base-100 items-center w-1/2 justify-around p-4 m-2 rounded-xl">
            <div className="flex items-center">
              <p className="text-2xl align-middle">Winrate last</p>
              <select
                className="select select-bordered select-sm mx-1 mt-1"
                onChange={(e) => {
                  setRecentMatchLimit(Number(e.target.value));
                  console.log(recentMatchList);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <p className="text-2xl align-middle">games:</p>
            </div>
            <Pie
              data={[
                { id: "Loss", value: 100 - Number(recentWinrate.toFixed(2)) },
                { id: "Win", value: recentWinrate.toFixed(2) },
              ]}
              width={150}
              height={150}
              colors={["#a83232", "#32a852"]}
              enableArcLinkLabels={false}
              isInteractive={true}
              activeOuterRadiusOffset={4}
              arcLabel={(label) => `${label.value}%`}
              margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
