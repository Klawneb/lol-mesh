import { useAtom } from "jotai";
import { Regions } from "twisted/dist/constants";
import { api } from "../utils/api";
import { regionAtom } from "../utils/atoms";
import type { Summoner } from "../utils/types";
import NameInput from "./NameInput";

interface SummonerViewProps {
  summoner: Summoner;
  setSummoner: (summoner: Summoner) => void;
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
    }
  );

  async function fetchSummoner() {
    await summonerData.refetch();
  }

  return (
    <div className="w-full flex flex-col items-center">
      <NameInput summoner={summoner} setSummoner={setSummoner} refetch={fetchSummoner} />
    </div>
  );
}
