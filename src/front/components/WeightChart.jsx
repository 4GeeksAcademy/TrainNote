import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

export const WeightChart = ({ weightData }) => {
  const dataList = weightData || [];

  const labels = dataList.map((d) => d.fecha || "");
  const weights = dataList.map((d) => parseFloat(d.PesoKg || d.peso_kg || 0));

  const minW = weights.length > 0 ? Math.min(...weights) - 1 : 0;
  const maxW = weights.length > 0 ? Math.max(...weights) + 1 : 100;

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Peso (kg)",
        data: weights,
        borderColor: "#ff6b00",
        backgroundColor: "rgba(255, 107, 0, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#0a0a0a",
        pointBorderColor: "#ff6b00",
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#ff6b00",
        bodyColor: "#ffffff",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        callbacks: {
          label: (context) => ` Peso: ${context.parsed.y} kg`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#e2bfb0",
          font: {
            family: "monospace",
            size: 10,
          },
        },
      },
      y: {
        min: minW,
        max: maxW,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#e2bfb0",
          font: {
            family: "monospace",
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 shadow-2xl hover:border-[#ff6b00]/30 transition-all w-full flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-tight text-white">
            EVOLUCIÓN DE <span className="text-[#ff6b00]">PESO ÚLTIMO MES</span>
          </h3>
          <p className="text-xs font-mono text-[#e2bfb0]/60">Historial detallado registrado</p>
        </div>
      </div>

      <div className="relative h-64 w-full bg-[#0d0d0d]/80 rounded-xl p-4 border border-white/5">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};