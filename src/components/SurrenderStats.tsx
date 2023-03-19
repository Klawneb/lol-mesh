import { Pie } from "@nivo/pie";
import type { Participant } from "@prisma/client";

interface SurrenderStatsProps {
  participants: (Participant | undefined)[];
}

export default function SurrenderStats({ participants }: SurrenderStatsProps) {
  const totalSurrenders = participants.reduce((prev, curr) => prev + (curr?.surrendered && !curr.win ? 1 : 0), 0);
  const surrenderRate = (totalSurrenders / participants.length) * 100;

  console.log(`you surrendered: ${totalSurrenders} games`);

  return (
    <div className="flex bg-base-100 items-center w-1/2 justify-around p-4 m-2 rounded-xl">
      <div>
        <p className="text-2xl">Surrender Rate:</p>
        <p className="text-5xl">{surrenderRate.toFixed(2)}%</p>
      </div>
      <Pie
        data={[
          { id: "Non-Surrenders", value: participants.length - totalSurrenders },
          { id: "Surrenders", value: totalSurrenders },
        ]}
        width={150}
        height={150}
        colors={{ scheme: "category10" }}
        enableArcLinkLabels={false}
        isInteractive={true}
        activeOuterRadiusOffset={4}
        arcLabel={(label) => `${label.id === "Surrenders" ? `${label.value} FF's` : `${label.value} Non-FF's`}`}
        arcLabelsSkipAngle={50}
        margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
      />
    </div>
  );
}
