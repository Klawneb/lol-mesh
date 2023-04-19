import { Pie } from "@nivo/pie";
import type { Match } from "@prisma/client";
import { format } from "date-fns";
import { MatchWithParticipants } from "../utils/types";

interface GameLengthStatsProps {
  matchList: MatchWithParticipants[];
}

export default function GameLengthStats({ matchList }: GameLengthStatsProps) {
  const totalLength =
    matchList.reduce((prev, curr) => {
      if (curr.matchLength.toString().length > 5) {
        return prev + curr.matchLength / 1000;
      }
      return prev + curr.matchLength;
    }, 0) * 1000;
  const averageGameLength = totalLength / matchList.length;

  return (
    <div className="flex bg-base-100 p-2 justify-center items-center rounded-xl h-40">
      <div>
        <p className="text-2xl">Average game length:</p>
        <p className="text-5xl text-center">{format(averageGameLength, "mm:ss")}</p>
      </div>
    </div>
  );
}
