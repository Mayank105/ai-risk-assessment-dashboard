import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Download, RefreshCw, FileText } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';
import { RiskAssessment } from '../types';
import { generatePDF } from '../utils/pdfGenerator';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskDashboardProps {
  assessment: RiskAssessment;
  onNewSession: () => void;
}

export function RiskDashboard({ assessment, onNewSession }: RiskDashboardProps) {
  const exactScore = Math.min(100, Math.max(0, assessment.score)); // Ensures valid range [0,100]

  // Color assignment based on risk level
const riskColors: { [key: string]: string } = {
    'Critical': '#b91c1c', // Darker red for critical risk
    'High': '#ef4444',      // Red
    'Medium': '#f59e0b',    // Amber
    'Low': '#10b981',       // Green
    'Minimal': '#22c55e'    // Lighter green
  }; 

  const riskIcons: { [key: string]: JSX.Element } = {
    'Critical': <AlertTriangle className="w-6 h-6 text-red-700 mr-2" />,
    'High': <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />,
    'Medium': <Shield className="w-6 h-6 text-amber-500 mr-2" />,
    'Low': <CheckCircle className="w-6 h-6 text-green-500 mr-2" />,
    'Minimal': <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
  };

  const riskLevelColor = riskColors[assessment.riskLevel] || '#22c55e'; // Default to green if unknown

const getRiskColor = (score: number) => {
  if (score >= 80) return '#dc2626'; // Critical (Darker Red)
  if (score >= 65) return '#ef4444'; // High (Red)
  if (score >= 45) return '#f59e0b'; // Medium (Amber)
  if (score >= 25) return '#22c55e'; // Low (Green)
  return '#16a34a'; // Minimal (Darker Green)
};

const chartData = {
  labels: ['Risk Score', 'Safe Score'],
  datasets: [
    {
      data: [exactScore, 100 - exactScore],
      backgroundColor: [getRiskColor(exactScore), '#e5e7eb'],
      borderWidth: 0,
    },
  ],
};
  const handleDownloadJSON = () => {
    const report = {
      riskLevel: assessment.riskLevel,
      score: assessment.score,
      recommendations: assessment.recommendations,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, `risk-assessment-${Date.now()}.json`);
  };

  const handleDownloadPDF = () => {
    generatePDF(assessment);
  };

  return (
    <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-lg shadow-lg p-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center">
          <div className="w-64 h-64">
            <Doughnut data={chartData} options={{ cutout: '70%' }} />
          </div>
          <div className="mt-4 flex items-center">
            {riskIcons[assessment.riskLevel]}
            <h2 className={`text-2xl font-bold`} style={{ color: riskLevelColor }}>
              {assessment.riskLevel} Risk
            </h2>
          </div>
          <p className="text-gray-600 mt-2">
            Risk Score: {exactScore}/100
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
          <ul className="space-y-3">
            {assessment.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={handleDownloadJSON}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download JSON
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          Download PDF
        </button>
        <button
          onClick={onNewSession}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Session
        </button>
      </div>
    </div>
  );
}
