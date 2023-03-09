import { MatchWithParticipants, Summoner } from "../utils/types";

interface CommonMatchStatsProps {
  commonMatches: MatchWithParticipants[];
  summoner1: Summoner;
  summoner2: Summoner;
}

export default function CommonMatchStats({ commonMatches, summoner1, summoner2 }: CommonMatchStatsProps) {
  const summoner1Participations = commonMatches.map((match) => match.participants.find((participation) => participation.uuid === summoner1.puuid));
  const winrate = (summoner1Participations.filter((participantion) => participantion?.win).length / summoner1Participations.length)*100;

  return (
    <div className="flex-grow bg-base-200 m-4 p-4 rounded-xl">
      <p>Winrate: {winrate}%</p>
    </div>
  );
}
