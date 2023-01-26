import { type NextPage } from "next";
import { useState } from "react";
import RegionSelect from "../components/RegionSelect";
import SummonerView from "../components/SummonerView";
import VerticalDivider from "../components/VerticalDivider";
import type { Summoner } from "../utils/types";

const Home: NextPage = () => {
  const [summoner1, setSummoner1] = useState<Summoner>({
    name: "",
  });
  const [summoner2, setSummoner2] = useState<Summoner>({
    name: "",
  });

  return (
    <div className="flex h-screen flex-col items-center bg-base-300">
      <h1 className="text-9xl font-bold underline decoration-primary">LOL MESH</h1>
      <div className="mt-6">
        <RegionSelect />
      </div>
      <div className="flex w-screen flex-grow">
        <SummonerView setSummoner={setSummoner1} summoner={summoner1} />
        <VerticalDivider />
        <SummonerView setSummoner={setSummoner2} summoner={summoner2} />
      </div>
    </div>
  );
};

export default Home;
