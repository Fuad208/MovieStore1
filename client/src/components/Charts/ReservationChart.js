import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './ChartSetup'; // Import the setup

const ReservationChart = ({ data, type = 'line' }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: 'Reservations',
        data: data.values || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Reservation Statistics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      default:
        return <Line data={chartData} options={options} />;
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      {renderChart()}
    </div>
  );
};

export default ReservationChart;