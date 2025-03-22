import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RiskAssessment } from '../types';

export function generatePDF(assessment: RiskAssessment): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Add watermark
  doc.setFontSize(60);
  doc.setTextColor(230, 230, 230);
  doc.setFont('helvetica', 'italic');
  doc.text('ToGo Risk Assessor', pageWidth/2, doc.internal.pageSize.height/2, {
    align: 'center',
    angle: 45
  });

  // Reset font for content
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  
  // Header
  doc.text('Security Risk Assessment Report', pageWidth/2, 20, { align: 'center' });
  
  // Risk Level and Score
  doc.setFontSize(16);
  doc.setTextColor(
    assessment.riskLevel === 'High' ? '#ef4444' :
    assessment.riskLevel === 'Medium' ? '#f59e0b' : '#22c55e'
  );
  doc.text(`Risk Level: ${assessment.riskLevel}`, 20, 40);
  doc.text(`Risk Score: ${assessment.score}/100`, 20, 50);
  
  // Recommendations
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Recommendations:', 20, 70);
  
  autoTable(doc, {
    startY: 80,
    head: [['#', 'Recommendation']],
    body: assessment.recommendations.map((rec, index) => [
      index + 1,
      rec
    ]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 12 }
  });
  
  // Footer with timestamp
  const timestamp = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on: ${timestamp}`, 20, doc.internal.pageSize.height - 20);
  
  // Save the PDF
  doc.save(`risk-assessment-${Date.now()}.pdf`);
}