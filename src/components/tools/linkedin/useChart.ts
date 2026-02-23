import { useEffect, useRef, useState } from 'react';

type ChartModule = typeof import('chart.js/auto');

let chartPromise: Promise<ChartModule> | null = null;

export function useChart() {
  const [Chart, setChart] = useState<ChartModule | null>(null);

  useEffect(() => {
    if (!chartPromise) {
      chartPromise = import('chart.js/auto');
    }
    chartPromise.then((mod) => {
      const C = mod.default ?? mod;
      // Set defaults
      (C as any).defaults.color = '#8888aa';
      (C as any).defaults.font = { ...(C as any).defaults.font, family: "'Noto Sans KR', sans-serif", size: 11 };
      setChart(() => mod);
    });
  }, []);

  return Chart;
}

export function useChartCanvas(
  Chart: ChartModule | null,
  config: any,
  deps: any[] = [],
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!Chart || !canvasRef.current) return;
    const C = (Chart as any).default ?? Chart;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new C(canvasRef.current, config);
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Chart, ...deps]);

  return canvasRef;
}
