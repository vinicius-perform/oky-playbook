import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { appData } from '../data';

export const generatePDF = (
    meetingMeta: { clientName: string; date: string; responsible: string },
    checkedItems: Record<string, boolean>,
    textValues: Record<string, string>
) => {
    const doc = new jsPDF();

    // Custom colors and fonts
    const primaryColor: [number, number, number] = [10, 10, 10]; // Near black
    const secondaryColor: [number, number, number] = [100, 100, 100]; // Gray

    // Add Header
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text(appData.title, 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(...secondaryColor);
    doc.text(appData.subtitle, 14, 30);

    // Date and Time
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Header Metadata
    doc.setFontSize(10);
    doc.text(`Cliente:`, 14, 38);
    doc.setFont("helvetica", "bold");
    doc.text(`${meetingMeta.clientName}`, 28, 38);

    doc.setFont("helvetica", "normal");
    doc.text(`Data:`, 14, 44);
    doc.setFont("helvetica", "bold");
    doc.text(`${meetingMeta.date} (Gerado às ${timeStr})`, 24, 44);

    doc.setFont("helvetica", "normal");
    doc.text(`Responsável FA:`, 14, 50);
    doc.setFont("helvetica", "bold");
    doc.text(`${meetingMeta.responsible}`, 44, 50);

    // Horizontal line
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 54, 196, 54);

    let currentY = 62;

    // Render sections
    appData.sections.forEach((section, index) => {
        // Check if we need a new page
        if (currentY > 260) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text(`${(index + 1).toString().padStart(2, '0')}. ${section.title}`, 14, currentY);
        currentY += 8;

        // Items table
        doc.setFont("helvetica", "normal");

        if (section.items.length > 0) {
            const tableData = section.items.map(item => {
                const itemId = `${section.id}-${item}`;
                const isChecked = checkedItems[itemId] ? 'Sim' : 'Não';
                return [item, isChecked];
            });

            autoTable(doc, {
                startY: currentY,
                head: [['Item', 'Concluído']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
                styles: { fontSize: 10, cellPadding: 3 },
                margin: { left: 14, right: 14 }
            });

            currentY = (doc as any).lastAutoTable.finalY + 10;
        }

        // Diagnostics and Reasons
        if (section.requiresReason) {
            const reasonVal = textValues[`reason-${section.id}`] || 'Nenhum motivo informado.';
            if (currentY > 270) { doc.addPage(); currentY = 20; }

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Motivo:", 14, currentY);
            currentY += 5;

            doc.setFont("helvetica", "normal");
            doc.setTextColor(50, 50, 50);

            const lines = doc.splitTextToSize(reasonVal, 180);
            doc.text(lines, 14, currentY);
            currentY += (lines.length * 5) + 5;
        }

        if (section.requiresDiagnostic) {
            const diagVal = textValues[`diag-${section.id}`] || 'Nenhum diagnóstico informado.';
            if (currentY > 270) { doc.addPage(); currentY = 20; }

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...primaryColor);
            doc.text("Saída Obrigatória:", 14, currentY);
            currentY += 5;

            doc.setFont("helvetica", "normal");
            doc.setTextColor(50, 50, 50);

            const lines = doc.splitTextToSize(diagVal, 180);
            doc.text(lines, 14, currentY);
            currentY += (lines.length * 5) + 10;
        }
    });

    // Export
    const safeClientName = meetingMeta.clientName.replace(/[^a-z0-9]/gi, '_');
    doc.save(`Reuniao-${safeClientName}-${meetingMeta.date}.pdf`);
};
