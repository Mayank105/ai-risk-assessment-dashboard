import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { RiskDashboard } from './components/RiskDashboard';
import { analyzeRisk } from './utils/riskAnalysis';
import { aiModel } from './utils/aiModel';
import { SecurityData, RiskAssessment } from './types';

function App() {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);

  useEffect(() => {
    // Initialize AI model
    aiModel.initialize();
    
    // Initialize particles background
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      (window as any).particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: false },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
          move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
          modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleDataLoaded = async (data: SecurityData[]) => {
    if (data.length > 0) {
      const aiPrediction = await aiModel.predict(data[0]);
      const result = analyzeRisk({ ...data[0], 'Risk Level': aiPrediction });
      setAssessment(result);
    }
  };

  const handleNewSession = () => {
    setAssessment(null);
  };

  return (
    <>
      <div id="particles-js" className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 to-blue-900" />
      <div className="relative min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              AI-Powered Risk Assessment
            </h1>
            <p className="text-lg text-gray-300">
              Upload your security configuration file for instant AI analysis
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            {!assessment && <FileUpload onDataLoaded={handleDataLoaded} />}
            
            {assessment && (
              <div className="mt-8 w-full">
                <RiskDashboard 
                  assessment={assessment}
                  onNewSession={handleNewSession}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;