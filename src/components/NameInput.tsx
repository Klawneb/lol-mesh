import type { Summoner } from "../utils/types";

interface NameInputProps {
  summoner: Summoner;
  setSummoner: (summoner: Summoner) => void;
  refetch: () => Promise<void>;
}

export default function NameInput({ summoner, setSummoner, refetch }: NameInputProps) {
  return (
    <form
      className="flex w-full"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input
        type="text"
        className="input flex-grow"
        value={summoner.nameInput}
        onChange={(e) =>
          setSummoner({
            ...summoner,
            nameInput: e.target.value,
            puuid: ""
          })
        }
      />
      <button className="btn btn-primary ml-2" onClick={refetch}>
        Submit
      </button>
    </form>
  );
}
