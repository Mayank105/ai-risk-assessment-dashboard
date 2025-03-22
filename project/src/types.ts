export interface SecurityData {
  'Firewall Enabled': number;
  'Encryption Used': number;
  'Admin Accounts': number;
  'Unpatched Vulnerabilities': number;
  'Remote Access Allowed': number;
  'Antivirus Installed': number;
  'Security Audit Completed': number;
  'Risk Level': string;
}

export interface RiskAssessment {
  riskLevel: string;
  recommendations: string[];
  score: number;
}