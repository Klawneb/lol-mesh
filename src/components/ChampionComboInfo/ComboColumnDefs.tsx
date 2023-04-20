import { createColumnHelper } from "@tanstack/react-table";
import { ChampionComboRow } from "../../utils/types";

const columnHelper = createColumnHelper<ChampionComboRow>();

export function getComboColumnDefs(summoner1: string, summoner2: string) {
  const comboColumnDefs = [
    columnHelper.accessor((row) => row.summoner1Champion, {
      id: "summoner1_champion",
      cell: (info) => info.getValue(),
      header: () => <span>{summoner1}</span>,
    }),
    columnHelper.accessor((row) => row.summoner2Champion, {
      id: "summoner2_champion",
      cell: (info) => info.getValue(),
      header: () => <span>{summoner2}</span>,
    }),
    columnHelper.accessor((row) => row.totalGames, {
      id: "total_games",
      cell: (info) => info.getValue(),
      header: () => <span>Total Games</span>,
    }),
    columnHelper.accessor((row) => row.totalWins, {
      id: "total_wins",
      cell: (info) => info.getValue(),
      header: () => <span>Total Wins</span>,
    }),
    columnHelper.accessor((row) => row.winrate, {
      id: "winrate",
      cell: (info) => info.getValue(),
      header: () => <span>Winrate</span>,
    }),
    columnHelper.accessor((row) => row.score, {
      id: "score",
      cell: (info) => info.getValue(),
      header: () => <span>Score</span>,
    }),
  ];
  return comboColumnDefs;
}
