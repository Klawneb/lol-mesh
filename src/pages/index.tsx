import { type NextPage } from "next";
import { useState } from "react";
import CommonMatchStats from "../components/CommonMatchStats";
import RegionSelect from "../components/RegionSelect";
import SummonerView from "../components/SummonerView";
import type { Summoner } from "../utils/types";

const Home: NextPage = () => {
  const [summoner1, setSummoner1] = useState<Summoner>({
    name: "",
    matchHistory: [],
    puuid: "",
  });
  const [summoner2, setSummoner2] = useState<Summoner>({
    name: "",
    matchHistory: [],
    puuid: "",
  });

  const commonMatches = summoner1.matchHistory.filter((match) => {
    return summoner2.matchHistory.map((match) => match.id).includes(match.id);
  });

  return (
    <div className="flex h-screen flex-col items-center bg-base-300">
      <h1 className="text-9xl font-bold underline decoration-primary">LOL MESH</h1>
      <div className="mt-6">
        <RegionSelect />
      </div>
      <div className="flex w-screen flex-grow">
        <SummonerView setSummoner={setSummoner1} summoner={summoner1} />
        <CommonMatchStats commonMatches={commonMatches} summoner1={summoner1} summoner2={summoner2}/>
        <SummonerView setSummoner={setSummoner2} summoner={summoner2} />
      </div>
    </div>
  );
};

export default Home;
