import type { Summoner } from "../utils/types";

interface NameInputProps {
  summoner: Summoner;
  setSummoner: (summoner: Summoner) => void;
  refetch: () => Promise<void>
}

export default function NameInput({ summoner, setSummoner, refetch }: NameInputProps) {
  return (
    <div className="flex w-[500px]">
      <input
        type="text"
        className="input flex-grow"
        value={summoner.name}
        onChange={(e) =>
          setSummoner({
            ...summoner,
            name: e.target.value,
          })
        }
      />
      <button className="btn btn-primary ml-2" onClick={refetch}>
        Submit
      </button>
    </div>
  );
}
