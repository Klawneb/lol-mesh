import type { Match, Participant } from "@prisma/client";
import Image from "next/image";
import { MatchWithParticipants } from "../utils/types";

interface MatchHistoryViewProps {
  matchHistory: MatchWithParticipants[];
  puuid: string | undefined;
}

export default function MatchHistoryView({ matchHistory, puuid }: MatchHistoryViewProps) {
  const participations = matchHistory
    .sort((a, b) => b.startTime.valueOf() - a.startTime.valueOf())
    .map((match) => {
      return match.participants.find((participant) => {
        return participant.uuid === puuid;
      });
    })
		.filter((participant) => {
			return participant !== undefined
		})

  return (
    <div className="flex flex-col">
      {participations.map((participation) => {
        return (
          <div key={participation?.matchId} className={`flex items-center w-[500px] h-24 mt-2 rounded-lg ${participation?.win ? "bg-green-300" : "bg-red-300"}`}>
            <Image
              alt="summoner-icon"
              src={`https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${participation?.champion}.png`}
              width={128}
              height={128}
              className="w-20 h-20 m-4 rounded-lg"
            />
            <div>
              <p className="text-black font-bold">
                {participation?.kills}/{participation?.deaths}/{participation?.assists}
              </p>
            </div>
            <div>
              <p>{}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
