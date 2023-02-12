import { Participant } from "@prisma/client";
import { useAtom } from "jotai";
import { Dispatch, SetStateAction } from "react";
import { Regions } from "twisted/dist/constants";
import { api } from "../utils/api";
import { regionAtom } from "../utils/atoms";
import type { Summoner } from "../utils/types";
import NameInput from "./NameInput";
import SummonerInfo from "./SummonerInfo";

interface SummonerViewProps {
  summoner: Summoner;
  setSummoner: Dispatch<SetStateAction<Summoner>>;
}

export default function SummonerView({ summoner, setSummoner }: SummonerViewProps) {
  const [region] = useAtom(regionAtom);
  const summonerData = api.riot.getSummoner.useQuery(
    {
      region: Regions[region as keyof typeof Regions],
      summonerName: summoner.name,
    },
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
    }
  );
  const matchHistoryData = api.riot.getMatchHistory.useQuery(
    {
      summonerUUID: summonerData.data?.response.puuid,
    },
    {
      onSuccess: (data) => {
        setSummoner((prevState) => {
          return {
            ...prevState,
            matchHistory: data,
          };
        });
      },
    }
  );
  const participations =
    matchHistoryData.data
      ?.sort((a, b) => b.startTime.valueOf() - a.startTime.valueOf())
      .map((match) => {
        return match.participants.find((participant) => {
          return participant.uuid === summonerData.data?.response.puuid;
        });
      }) ?? ([] as Participant[]);

  async function fetchSummoner() {
    await summonerData.refetch();
  }

  async function fetchMatchHistory() {
    await matchHistoryData.refetch();
  }

  return (
    <div className="w-full flex flex-col items-center">
      <NameInput summoner={summoner} setSummoner={setSummoner} refetch={fetchSummoner} />
      {summonerData.isFetched && summonerData.data ? <SummonerInfo summonerData={summonerData.data?.response} fetchMatchHistory={fetchMatchHistory} /> : null}
      {participations.map((participant) => (
        <p key={participant?.matchId}>{participant?.champion}</p>
      ))}
    </div>
  );
}
