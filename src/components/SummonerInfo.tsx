import { useAtom } from "jotai";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Regions, regionToRegionGroup } from "twisted/dist/constants";
import type { SummonerV4DTO } from "twisted/dist/models-dto";
import { api } from "../utils/api";
import { globalFetchingAtom, regionAtom } from "../utils/atoms";
import { MatchWithParticipants } from "../utils/types";

interface SummonerInfoProps {
  summonerData: SummonerV4DTO;
  isFetching: boolean;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
}

export default function SummonerInfo({ summonerData, isFetching, setIsFetching }: SummonerInfoProps) {
  const updateMatchHistory = api.riot.updateMatchHistory.useMutation();
  const [region] = useAtom(regionAtom);
  const [checking, setChecking] = useState(false);
  const [upToDate, setUpToDate] = useState(false);
  const [globalFetching, setGlobalFetching] = useAtom(globalFetchingAtom);
  const [outstandingIDs, setOutstandingIDs] = useState<string[]>([]);
  const fetchedMatches = api.riot.getFetchedMatches.useQuery(
    {
      matchIDs: outstandingIDs,
    },
    {
      enabled: false,
    }
  );
  const champPool = api.riot.getChampionPool.useQuery({
    uuid: summonerData.puuid,
  });

  useEffect(() => {
    async function checkFetched() {
      await fetchedMatches.refetch();
      if (fetchedMatches.data === outstandingIDs.length) {
        setIsFetching(false);
        setGlobalFetching(false);
      }
    }

    let fetchTimer: NodeJS.Timer;
    if (isFetching) {
      fetchTimer = setInterval(() => {
        void checkFetched();
      }, 1500);
    }
    return () => {
      clearInterval(fetchTimer);
    };
  }, [fetchedMatches, isFetching, outstandingIDs.length, setGlobalFetching, setIsFetching]);

  function toggleUpToDate() {
    if (!upToDate) {
      setUpToDate(true);
      setTimeout(() => {
        setUpToDate(false);
      }, 3000);
    }
  }

  return (
    <div className="bg-base-100 w-full mt-2 flex justify-between rounded-lg">
      <Image
        alt="summoner-icon"
        src={`https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${summonerData?.profileIconId}.png`}
        width={128}
        height={128}
        className="w-24 h-24 m-4 rounded-lg"
      />
      <div className="flex flex-col my-auto ml-2 max-w overflow-hidden">
        <p className="text-4xl font-semibold truncate ">{summonerData.name}</p>
        <p className="mt-2 text-xl">Level {summonerData.summonerLevel}</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p>Filter:</p>
        <select className="select select-bordered bg-base-200">
          <option value="ANY">-- ANY --</option>
          <option value="TOP">-- TOP --</option>
          <option value="JUNGLE">-- JUNGLE --</option>
          <option value="MIDDLE">-- MID --</option>
          <option value="BOTTOM">-- BOT --</option>
          <option value="UTILITY">-- SUPPORT --</option>
          {champPool.data &&
            champPool.data.sort().map((champName) => {
              return (
                <option key={champName} value={champName}>
                  {champName}
                </option>
              );
            })}
        </select>
      </div>
      <div className="flex flex-col my-auto mr-4">
        <button
          onClick={async () => {
            setChecking(true);
            const outstandingIDs = await updateMatchHistory.mutateAsync({
              uuid: summonerData.puuid,
              regionGroup: regionToRegionGroup(Regions[region as keyof typeof Regions]),
            });
            if (outstandingIDs.length === 0) {
              toggleUpToDate();
            } else {
              setOutstandingIDs(outstandingIDs);
              setIsFetching(true);
              setGlobalFetching(true);
            }
            setChecking(false);
          }}
          className={`btn btn-secondary transition-all ${upToDate ? "btn-info disabled" : ""} ${isFetching || checking ? "loading btn-info disabled" : ""}`}
        >
          {checking ? "Checking" : upToDate ? "Up to date" : isFetching ? `Fetching ${fetchedMatches.data ?? "?"}/${outstandingIDs.length}` : "Update"}
        </button>
      </div>
    </div>
  );
}
