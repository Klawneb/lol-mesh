import { Pie } from "@nivo/pie";
import { useState } from "react";
import { api } from "../utils/api";
import type { MatchWithParticipants, Summoner } from "../utils/types";
import ChampionComboStats from "./ChampionComboStats";
import GameLengthStats from "./GameLengthStats";
import SurrenderStats from "./SurrenderStats";
import WinRateStats from "./WinRateStats";

interface CommonMatchStatsProps {
  summoner1: Summoner;
  summoner2: Summoner;
}

export default function CommonMatchStats({ summoner1, summoner2 }: CommonMatchStatsProps) {
  const commonMatches = api.riot.getCommonMatches.useQuery({ summoner1puuid: summoner1.puuid, summoner2puuid: summoner2.puuid });
  const summoner1Participations = commonMatches.data ? commonMatches.data.map((match) => match.participants.find((participant) => participant.uuid === summoner1.puuid)) : [];

  return (
    <div className="flex-grow bg-base-200 m-4 p-4 rounded-xl">
      {commonMatches.data && commonMatches.data.length > 0 ? (
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-2 gap-3">
            <WinRateStats participants={summoner1Participations} />
            <SurrenderStats participants={summoner1Participations} />
            <GameLengthStats matchList={commonMatches.data} />
          </div>
          <ChampionComboStats commonMatches={commonMatches.data} summoner1={summoner1} summoner2={summoner2} />
        </div>
      ) : null}
    </div>
  );
}
