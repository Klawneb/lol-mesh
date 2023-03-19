import { Pie } from "@nivo/pie";
import type { Match } from "@prisma/client";
import { format } from "date-fns";

interface GameLengthStatsProps {
  matchList: Match[];
}

export default function GameLengthStats({ matchList }: GameLengthStatsProps) {
  const totalLength = matchList.reduce((prev, curr) => prev + curr.matchLength, 0) * 1000;
  const averageGameLength = totalLength / matchList.length;

  return (
    <div className="flex bg-base-100 p-2 items-center rounded-xl">
      <div className="ml-[5%]">
        <p className="text-2xl">Average game length:</p>
        <p className="text-5xl">{format(averageGameLength, 'mm:ss')}</p>
      </div>
    </div>
  );
}
