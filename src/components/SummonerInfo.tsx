import { useAtom } from "jotai";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Regions, regionToRegionGroup } from "twisted/dist/constants";
import type { SummonerV4DTO } from "twisted/dist/models-dto";
import { api } from "../utils/api";
import { regionAtom } from "../utils/atoms";
import { MatchWithParticipants } from "../utils/types";

interface SummonerInfoProps {
  summonerData: SummonerV4DTO;
  fetchMatchHistory: () => void;
  matchHistory: MatchWithParticipants[];
}

export default function SummonerInfo({ summonerData, fetchMatchHistory, matchHistory }: SummonerInfoProps) {
  const updateMatchHistory = api.riot.updateMatchHistory.useMutation();
  const [region] = useAtom(regionAtom);
  const [oustandingMatches, setOutstandingMatches] = useState<string[]>([]);
  const [upToDate, setUpToDate] = useState(false);
  const [checking, setChecking] = useState(false);
  const fetchedMatches = oustandingMatches.reduce((prev, curr) => {
    return prev + (matchHistory.map((match) => match.id).includes(curr) ? 1 : 0);
  }, 0);
  const fetching = oustandingMatches.length != fetchedMatches;

  useEffect(() => {
    if (upToDate) {
      const timeout = setTimeout(() => {
        setUpToDate(false);
      }, 3000);
    }
  }, [upToDate]);

  useEffect(() => {
    let refreshInterval: NodeJS.Timer;
    if (fetching) {
      refreshInterval = setInterval(() => {
        fetchMatchHistory();
      }, 1000);
    }
    return () => {
      clearInterval(refreshInterval);
    };
  }, [fetching, fetchMatchHistory, fetchedMatches]);

  return (
    <div className="bg-base-100 w-full mt-2 flex rounded-lg">
      <Image
        alt="summoner-icon"
        src={`https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${summonerData?.profileIconId}.png`}
        width={128}
        height={128}
        className="w-24 h-24 m-4 rounded-lg"
      />
      <div className="flex flex-col my-auto ml-2">
        <p className="text-4xl font-semibold">{summonerData.name}</p>
        <p className="mt-2 text-xl">Level {summonerData.summonerLevel}</p>
      </div>
      <div className="flex flex-col my-auto ml-auto mr-4">
        <button
          onClick={async () => {
            setChecking(true);
            const outstandingIDs = await updateMatchHistory.mutateAsync({
              uuid: summonerData.puuid,
              regionGroup: regionToRegionGroup(Regions[region as keyof typeof Regions]),
            });
            setChecking(false);
            if (outstandingIDs.length === 0) {
              setUpToDate(true);
            } else {
              setOutstandingMatches(outstandingIDs);
            }
          }}
          className={`btn btn-secondary transition-all ${upToDate ? "btn-info" : ""} ${fetching || checking ? "loading btn-info disabled" : ""}`}
        >
          {checking ? "Checking" : upToDate ? "Up to date" : fetching ? `Fetching ${fetchedMatches}/${oustandingMatches.length}` : "Update"}
        </button>
      </div>
    </div>
  );
}
