import { Pie } from "@nivo/pie";
import { useState } from "react";
import type { MatchWithParticipants, Summoner } from "../utils/types";
import ChampionComboStats from "./ChampionComboStats";
import WinRateStats from "./WinRateStats";

interface CommonMatchStatsProps {
  commonMatches: MatchWithParticipants[];
  summoner1: Summoner;
  summoner2: Summoner;
}

export default function CommonMatchStats({ commonMatches, summoner1, summoner2 }: CommonMatchStatsProps) {
  const summoner1Participations = commonMatches
    .sort((a, b) => b.startTime.valueOf() - a.startTime.valueOf())
    .map((match) => match.participants.find((participation) => participation.uuid === summoner1.puuid));

  return (
    <div className="flex-grow bg-base-200 m-4 p-4 rounded-xl">
      {commonMatches.length > 0 ? (
        <div>
          <WinRateStats participants={summoner1Participations} />
          <ChampionComboStats commonMatches={commonMatches} summoner1={summoner1} summoner2={summoner2}/>
        </div>
      ) : null}
    </div>
  );
}
