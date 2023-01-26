import { useAtom } from "jotai";
import { Regions } from "twisted/dist/constants";
import { regionAtom } from "../utils/atoms";

const RegionTranslations = {
  BRAZIL: "Brazil",
  EU_EAST: "EU Nordic & East",
  EU_WEST: "EU West",
  KOREA: "Korea",
  LAT_NORTH: "Latin America North",
  LAT_SOUTH: "Latin America South",
  AMERICA_NORTH: "North America",
  OCEANIA: "Oceania",
  TURKEY: "Turkey",
  RUSSIA: "Russia",
  JAPAN: "Japan",
  PBE: "PBE",
};

export default function RegionSelect() {
  const [region, setRegion] = useAtom(regionAtom);

  return (
    <div className="flex flex-col items-center">
      <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
        {Object.keys(Regions).map((region) => {
          return (
            <option key={region} value={region}>
              {RegionTranslations[region as keyof typeof RegionTranslations]}
            </option>
          );
        })}
      </select>
    </div>
  );
}
