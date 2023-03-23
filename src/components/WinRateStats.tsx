import { Pie } from "@nivo/pie";
import type { Participant } from "@prisma/client";
import { useState } from "react";

interface WinRateStatsProps {
  participants: (Participant | undefined)[];
}

export default function WinRateStats({ participants }: WinRateStatsProps) {
  const [recentMatchLimit, setRecentMatchLimit] = useState(10);

  const totalWins = participants.filter((participantion) => participantion?.win).length;
  const totalWinrate = (totalWins / participants.length) * 100;

  const recentMatchList = participants.slice(0, recentMatchLimit);
  const recentTotalWins = recentMatchList.filter((participantion) => participantion?.win).length;
  const recentWinrate = (recentTotalWins / recentMatchList.length) * 100;

  return (
    <>
      <div className="flex bg-base-100 items-center justify-around rounded-xl">
        <div>
          <p className="text-2xl">All Time Winrate:</p>
          <p className="text-5xl">{totalWinrate.toFixed(2)}%</p>
        </div>
        <Pie
          data={[
            { id: "Loss", value: participants.length - totalWins },
            { id: "Win", value: totalWins },
          ]}
          width={150}
          height={150}
          colors={["#a83232", "#32a852"]}
          enableArcLinkLabels={false}
          isInteractive={true}
          activeOuterRadiusOffset={4}
          arcLabel={(label) => `${label.id === "Win" ? `${label.value} wins` : `${label.value} losses`}`}
          margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
        />
      </div>
      <div className="flex bg-base-100 items-center justify-around rounded-xl">
        <div>
          <div className="flex items-center">
            <p className="text-2xl align-middle">Winrate last</p>
            <select
              className="select select-bordered select-sm mx-1 mt-1"
              onChange={(e) => {
                setRecentMatchLimit(Number(e.target.value));
              }}
              value={recentMatchLimit}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <p className="text-2xl align-middle">games:</p>
          </div>
          <p className="text-5xl">{recentWinrate.toFixed(2)}%</p>
        </div>
        <Pie
          data={[
            { id: "Loss", value: recentMatchList.length - recentTotalWins },
            { id: "Win", value: recentTotalWins },
          ]}
          width={150}
          height={150}
          colors={["#a83232", "#32a852"]}
          enableArcLinkLabels={false}
          isInteractive={true}
          activeOuterRadiusOffset={4}
          arcLabel={(label) => `${label.id === "Win" ? `${label.value} wins` : `${label.value} losses`}`}
          margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
        />
      </div>
    </>
  );
}
