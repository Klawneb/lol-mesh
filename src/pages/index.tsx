import { type NextPage } from "next";
import { useState } from "react";
import CommonMatchStats from "../components/CommonMatchStats";
import RegionSelect from "../components/RegionSelect";
import SummonerView from "../components/SummonerView";
import type { Summoner } from "../utils/types";
import { summoner1FilterAtom, summoner2FilterAtom } from "../utils/atoms";

const Home: NextPage = () => {
  const [summoner1, setSummoner1] = useState<Summoner>({
    nameInput: "",
    summonerName: "",
    puuid: "",
    summonerFilter: summoner1FilterAtom,
  });
  const [summoner2, setSummoner2] = useState<Summoner>({
    nameInput: "",
    summonerName: "",
    puuid: "",
    summonerFilter: summoner2FilterAtom,
  });

  return (
    <div className="flex h-screen flex-col items-center bg-base-300">
      <h1 className="text-9xl font-bold underline decoration-primary">LOL MESH</h1>
      <div className="mt-6">
        <RegionSelect />
      </div>
      <div className="flex w-screen flex-grow">
        <SummonerView setSummoner={setSummoner1} summoner={summoner1} />
        <CommonMatchStats summoner1={summoner1} summoner2={summoner2} />
        <SummonerView setSummoner={setSummoner2} summoner={summoner2} />
      </div>
    </div>
  );
};

export default Home;
