import { SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { comboColumnDefs, getComboColumnDefs } from "./ComboColumnDefs";
import { ChampionComboRow } from "../../utils/types";
import { useState } from "react";

interface ChampionComboTableProps {
  summoner1Name: string;
  summoner2Name: string;
  comboData: ChampionComboRow[];
}

export function ChampionComboTable({ comboData, summoner1Name, summoner2Name }: ChampionComboTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns: getComboColumnDefs(summoner1Name, summoner2Name),
    data: comboData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  const headers = table.getFlatHeaders();
  const rows = table.getRowModel().rows;

  return (
    <table className="table table-zebra">
      <thead className="top-0 sticky">
        <tr>
          {headers.map((header) => {
            const direction = header.column.getIsSorted();
            const arrow = {
              asc: "🔼",
              desc: "🔽",
            };

            const sort_indicator = direction && arrow[direction];

            return (
              <th key={header.id}>
                {header.isPlaceholder ? null : (
                  <div onClick={header.column.getToggleSortingHandler()} className="cursor-pointer flex select-none">
                    <p>{flexRender(header.column.columnDef.header, header.getContext())}</p>
                    <p>{direction && <span>{sort_indicator}</span>}</p>
                  </div>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
