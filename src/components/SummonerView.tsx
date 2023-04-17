import { Participant } from "@prisma/client";
import { useAtom } from "jotai";
import { Dispatch, SetStateAction, useState } from "react";
import { Regions } from "twisted/dist/constants";
import { api } from "../utils/api";
import { regionAtom } from "../utils/atoms";
import type { Summoner } from "../utils/types";
import MatchHistoryView from "./MatchHistoryView";
import NameInput from "./NameInput";
import SummonerInfo from "./SummonerInfo";

interface SummonerViewProps {
  summoner: Summoner;
  setSummoner: Dispatch<SetStateAction<Summoner>>;
}

export default function SummonerView({ summoner, setSummoner }: SummonerViewProps) {
  const [region] = useAtom(regionAtom);
  const [isFetching, setIsFetching] = useState(false);
  const summonerData = api.riot.getSummoner.useQuery(
    {
      region: Regions[region as keyof typeof Regions],
      summonerName: summoner.name,
    },
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      onSuccess: (data) => {
        console.log(data)
        setSummoner((prevState) => {
          return {
            ...prevState,
            puuid: data.response.puuid,
          };
        });
      },
    }
  );

  async function fetchSummoner() {
    await summonerData.refetch();
  }

  return (
    <div className="w-1/4 flex flex-col items-center bg-base-200 m-4 p-4 rounded-xl">
      <NameInput summoner={summoner} setSummoner={setSummoner} refetch={fetchSummoner} />
      {summonerData.isFetched && summonerData.data ? <SummonerInfo summoner={summoner} summonerData={summonerData.data?.response} isFetching={isFetching} setIsFetching={setIsFetching}/> : null}
      <MatchHistoryView puuid={summonerData.data?.response.puuid} isFetching={isFetching} summoner={summoner}/>
    </div>
  );
}
