import { useAtom } from "jotai";
import Image from "next/image";
import { Regions, regionToRegionGroup } from "twisted/dist/constants";
import type { SummonerV4DTO } from "twisted/dist/models-dto";
import { api } from "../utils/api";
import { regionAtom } from "../utils/atoms";

interface SummonerInfoProps {
  summonerData: SummonerV4DTO;
}

export default function SummonerInfo({ summonerData }: SummonerInfoProps) {
  const updateMatchHistory = api.riot.updateMatchHistory.useMutation();
  const [region, setRegion] = useAtom(regionAtom);

  return (
    <div className="bg-base-100 w-[500px] mt-2 flex rounded-lg">
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
      <button
        onClick={() => {
          updateMatchHistory.mutate({
            uuid: summonerData.puuid,
            regionGroup: regionToRegionGroup(Regions[region as keyof typeof Regions]),
          });
        }}
        className="btn btn-secondary my-auto ml-auto mr-4"
      >
        Update
      </button>
    </div>
  );
}
