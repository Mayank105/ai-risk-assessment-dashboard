import { SecurityData, RiskAssessment } from '../types';

export function analyzeRisk(data: SecurityData): RiskAssessment {
  let score = 0;
  const recommendations: string[] = [];

  if (!data['Firewall Enabled']) {
    score += 20; // Reduced weight to allow more granularity
    recommendations.push('Enable firewall protection immediately.');
  }

  if (!data['Encryption Used']) {
    score += 15;
    recommendations.push('Implement encryption for sensitive data.');
  }

  if (data['Admin Accounts'] > 2) {
    score += data['Admin Accounts'] * 3; // Lower multiplier
    recommendations.push('Reduce the number of admin accounts.');
  }

  if (data['Unpatched Vulnerabilities'] > 0) {
    const vulnScore = Math.min(data['Unpatched Vulnerabilities'] * 3, 25); // Capped at 25
    score += vulnScore;
    recommendations.push(`Patch ${data['Unpatched Vulnerabilities']} vulnerabilities.`);
  }

  if (data['Remote Access Allowed'] && !data['Security Audit Completed']) {
    score += 15;
    recommendations.push('Conduct a security audit for remote access.');
  }

  if (!data['Antivirus Installed']) {
    score += 10;
    recommendations.push('Install and update antivirus software.');
  }

  // Normalize score to be between 0 and 100
  score = Math.min(100, score); 

  // More granular risk levels
  let riskLevel: string;
  if (score >= 80) {
    riskLevel = 'Critical';
  } else if (score >= 65) {
    riskLevel = 'High';
  } else if (score >= 45) {
    riskLevel = 'Medium';
  } else if (score >= 25) {
    riskLevel = 'Low';
  } else {
    riskLevel = 'Minimal';
  }

  console.log(`Final Risk Score: ${score}, Risk Level: ${riskLevel}`); // Debugging

  return {
    riskLevel,
    recommendations,
    score
  };
}