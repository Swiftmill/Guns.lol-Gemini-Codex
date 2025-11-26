import { useEffect, useRef } from 'react';
import { renderViewsChart } from '../lib/chart';
import { UserData } from '../lib/usersDB';

interface Props {
  data: UserData;
}

export default function DashboardOverviewTab({ data }: Props) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const dispose = renderViewsChart(canvas, data.views || 0);
    return dispose;
  }, [data.views]);

  return (
    <div className="dash-tab block" id="dash-overview">
      <h2 className="text-3xl font-bold mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-guns-card border border-guns-border p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Vues Totales</p>
          <h3 className="text-2xl font-bold mt-1" id="stat-views">
            {(data.views || 0).toLocaleString()}
          </h3>
        </div>
        <div className="bg-guns-card border border-guns-border p-6 rounded-xl">
          <p className="text-gray-400 text-sm">UID</p>
          <h3 className="text-2xl font-bold mt-1" id="stat-uid">
            #{data.uid}
          </h3>
        </div>
        <div className="bg-guns-card border border-guns-border p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Status</p>
          <h3 className="text-2xl font-bold mt-1 text-green-500">Active</h3>
        </div>
      </div>
      <div className="bg-guns-card border border-guns-border p-6 rounded-xl h-[300px]">
        <h3 className="font-bold mb-4">Statistiques</h3>
        <canvas ref={chartRef} id="viewsChart" />
      </div>
    </div>
  );
}
