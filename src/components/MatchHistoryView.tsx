import type { Match, Participant } from "@prisma/client";
import { formatDistanceStrict } from "date-fns";
import Image from "next/image";
import { MatchWithParticipants } from "../utils/types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";

interface MatchHistoryViewProps {
  matchHistory: MatchWithParticipants[];
  puuid: string | undefined;
}

export default function MatchHistoryView({ matchHistory, puuid }: MatchHistoryViewProps) {
  const [animationParent] = useAutoAnimate();
  const [matchesShown, setMatchesShown] = useState(10);

  return (
    <div ref={animationParent} className="flex flex-col flex-grow h-0 overflow-scroll w-full scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary mt-2">
      {matchHistory
        .slice(-matchesShown)
        .sort((a, b) => b.startTime.valueOf() - a.startTime.valueOf())
        .map((match) => {
          const participation = match.participants.find((participant) => {
            return participant.uuid === puuid;
          });
          if (participation) {
            const champion = participation.champion === "FiddleSticks" ? "Fiddlesticks" : participation.champion;
            return (
              <div key={match.id} className={`flex w-full mb-2 min-h-[75px] rounded-lg p-2 justify-between shadow-md items-center bg-base-100`}>
                <Image alt="summoner-icon" src={`https://ddragon.leagueoflegends.com/cdn/13.4.1/img/champion/${champion}.png`} width={128} height={128} className="w-16 h-16 rounded-lg" />
                <div className="w-1/3">
                  <p className="text-base-content font-bold text-3xl text-center">
                    {participation.kills}/{participation.deaths}/{participation.assists}
                  </p>
                </div>
                <div>{participation.win ? <p className="text-success">WIN</p> : <p className="text-error">LOSS</p>}</div>
                <div className="w-1/3">
                  <p className="text-base-content font-bold text-center">{formatDistanceStrict(match.startTime, Date.now())} ago</p>
                </div>
              </div>
            );
          }
          return null;
        })}

      {matchHistory.length > matchesShown ? (
        <div
          className="flex w-full mb-2 min-h-[75px] rounded-lg p-2 shadow-md items-center bg-base-100 justify-center text-3xl hover:cursor-pointer transition-all hover:b hover:bg-secondary"
          onClick={() => setMatchesShown((prev) => prev + 10)}
        >
          Load more
        </div>
      ) : null}
    </div>
  );
}
