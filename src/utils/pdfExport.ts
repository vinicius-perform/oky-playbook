import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { appData } from '../data';

export const generatePDF = (
    meetingMeta: { clientName: string; date: string; responsible: string },
    checkedItems: Record<string, boolean>,
    textValues: Record<string, string>
) => {
    const doc = new jsPDF();

    // Setup Colors
    const black: [number, number, number] = [17, 17, 17];
    const darkGray: [number, number, number] = [75, 75, 75];
    const lightGray: [number, number, number] = [235, 235, 235];
    const white: [number, number, number] = [255, 255, 255];

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Add Footer Function
    const addFooter = () => {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        const footerText = "Fazendo Acontecer | Todos os direitos reservados | 2026";
        const textWidth = doc.getTextWidth(footerText);
        doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
    };

    // --- PAGE 1: EXECUTIVE SUMMARY --- //

    // FA Logo (Make it bolder by drawing multiple times and centering carefully)
    doc.setFillColor(...black);
    doc.roundedRect(14, 15, 18, 18, 3, 3, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...white);

    // Centralized text offset specifically for the 'FA' letters inside the 18x18 square
    const logoX = 14 + (18 / 2);
    const logoY = 15 + (18 / 2) + 3; // Adjusted vertical offset to center perfectly inside the square

    doc.text("FA", logoX, logoY, { align: "center", baseline: "middle" });
    // Fake "Extra Bold" by redrawing it slightly offset
    doc.text("FA", logoX + 0.1, logoY, { align: "center", baseline: "middle" });
    doc.text("FA", logoX - 0.1, logoY, { align: "center", baseline: "middle" });
    doc.text("FA", logoX, logoY + 0.1, { align: "center", baseline: "middle" });
    doc.text("FA", logoX, logoY - 0.1, { align: "center", baseline: "middle" });

    // Header Title
    doc.setTextColor(...black);
    doc.setFontSize(18);
    doc.text("Reunião Estratégica", 36, 23);
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text("Checkpoint de OKRs - Resumo Executivo", 36, 29);

    // Datetime
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    doc.setFontSize(8);
    doc.text(`Gerado em: ${meetingMeta.date} às ${timeStr}`, 145, 23);

    // Meta Info Bar
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 36, 196, 36);

    doc.setFontSize(9);
    doc.setTextColor(...darkGray);
    doc.setFont("helvetica", "normal");
    doc.text("Cliente:", 14, 44);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...black);
    doc.text(meetingMeta.clientName || 'N/A', 27, 44);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkGray);
    doc.text("Responsável:", 90, 44);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...black);
    doc.text(meetingMeta.responsible || 'N/A', 113, 44);

    doc.line(14, 48, 196, 48);

    // CALC STATS
    let totalItems = 0;
    let completedItems = 0;

    appData.sections.forEach(s => {
        totalItems += s.items.length;
        s.items.forEach(item => {
            if (checkedItems[`${s.id}-${item}`]) completedItems++;
        });
    });

    const completionRate = totalItems === 0 ? 0 : completedItems / totalItems;

    // --- KPIs --- //
    const kpiY = 54;
    const cardWidth = 88;

    // KPI 1 - Total Itens
    doc.setFillColor(...lightGray);
    doc.roundedRect(14, kpiY, cardWidth, 22, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("TOTAL DE AÇÕES", 18, kpiY + 7);
    doc.setFontSize(18);
    doc.setTextColor(...black);
    doc.text(totalItems.toString(), 18, kpiY + 17);

    // KPI 2 - Concluídos
    doc.setFillColor(...black);
    doc.roundedRect(14 + cardWidth + 6, kpiY, cardWidth, 22, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 200, 200);
    doc.text("AÇÕES CONCLUÍDAS", 14 + cardWidth + 6 + 4, kpiY + 7);
    doc.setFontSize(18);
    doc.setTextColor(...white);
    doc.text(completedItems.toString(), 14 + cardWidth + 6 + 4, kpiY + 17);

    // --- CHARTS SECTION --- //
    const chartY = 84;

    // Left Box: Donut Chart
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(14, chartY, 80, 80, 2, 2, 'S');

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...black);
    doc.text("Saúde do Projeto", 18, chartY + 8);

    const cx = 54;
    const cy = chartY + 45;
    const r = 24;

    doc.setFillColor(235, 235, 235);
    doc.circle(cx, cy, r, 'F');

    if (completionRate > 0 && completionRate < 1) {
        doc.setFillColor(17, 17, 17);
        const startRad = -Math.PI / 2;
        const endRad = startRad + (completionRate * 2 * Math.PI);
        const steps = Math.max(10, Math.ceil(completionRate * 50));
        const lines: number[][] = [];
        let curX = cx; let curY = cy;

        let pX = cx + r * Math.cos(startRad);
        let pY = cy + r * Math.sin(startRad);
        lines.push([pX - cx, pY - cy]);
        curX = pX; curY = pY;

        for (let i = 1; i <= steps; i++) {
            const angle = startRad + (i / steps) * (endRad - startRad);
            const nX = cx + r * Math.cos(angle);
            const nY = cy + r * Math.sin(angle);
            lines.push([nX - curX, nY - curY]);
            curX = nX; curY = nY;
        }
        lines.push([cx - curX, cy - curY]);
        doc.lines(lines, cx, cy, [1, 1], 'F', true);
    } else if (completionRate === 1) {
        doc.setFillColor(17, 17, 17);
        doc.circle(cx, cy, r, 'F');
    }

    // Cutout Center
    doc.setFillColor(255, 255, 255);
    doc.circle(cx, cy, r * 0.65, 'F');

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...black);
    const pctText = `${Math.round(completionRate * 100)}%`;
    doc.text(pctText, cx, cy + 2, { align: "center" });

    // Right Box: Progress Bars by Section
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(98, chartY, 98, 80, 2, 2, 'S');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...black);
    doc.text("Progresso por Área", 102, chartY + 8);

    // Calculate vertical spacing based on 8 sections
    // Keep them well padded so they don't look squished.
    const startLineY = chartY + 16;
    const ySpacing = 8.5;
    let lineY = startLineY;

    appData.sections.forEach((section) => {
        const tItems = section.items.length;
        const cItems = section.items.filter(item => checkedItems[`${section.id}-${item}`]).length;
        const pct = tItems === 0 ? 0 : cItems / tItems;

        doc.setFontSize(7); // Go back to slightly smaller text so it doesn't wrap/touch the numbers
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...darkGray);

        let secTitle = section.title;
        if (secTitle.length > 30) secTitle = secTitle.substring(0, 28) + '...';
        doc.text(secTitle, 102, lineY);

        doc.text(`${Math.round(pct * 100)}%`, 184, lineY);

        // Track bar
        const barY = lineY + 1.2; // Increase distance from text slightly
        const barHeight = 2.5; // Thinner bar to increase white space
        doc.setFillColor(235, 235, 235);
        doc.roundedRect(102, barY, 88, barHeight, 1, 1, 'F');
        if (pct > 0) {
            doc.setFillColor(17, 17, 17);
            doc.roundedRect(102, barY, 88 * pct, barHeight, 1, 1, 'F');
        }

        lineY += ySpacing;
    });

    // --- GARGALOS (BOTTLENECKS) --- //
    let currentY = chartY + 90;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...black);
    doc.text("Anotações e Gargalos (Saídas)", 14, currentY);
    currentY += 6;

    let hasAnnotations = false;

    appData.sections.forEach(section => {
        if (section.requiresReason) {
            const annotation = textValues[`reason-${section.id}`];
            if (annotation && annotation.trim() !== '') {
                hasAnnotations = true;
                if (currentY > 260) {
                    addFooter();
                    doc.addPage();
                    currentY = 20;
                }

                doc.setFillColor(...lightGray);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                const lines = doc.splitTextToSize(annotation, 172);
                const boxHeight = 10 + (lines.length * 4.5);

                doc.roundedRect(14, currentY, 182, boxHeight, 2, 2, 'F');
                doc.setFillColor(...black);
                doc.roundedRect(14, currentY, 3, boxHeight, 2, 2, 'F');

                doc.setFont("helvetica", "bold");
                doc.setTextColor(...black);
                doc.text(section.title, 20, currentY + 6);

                doc.setFont("helvetica", "normal");
                doc.setTextColor(...darkGray);
                doc.text(lines, 20, currentY + 11);

                currentY += boxHeight + 4;
            }
        }
    });

    if (!hasAnnotations) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(...darkGray);
        doc.text("Nenhum gargalo ou anotação registrado.", 14, currentY + 4);
    }

    addFooter();

    // --- PAGE 2: DETAILED CHECKS (ANEXO) --- //
    doc.addPage();
    let currentYDetails = 25;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...black);
    doc.text("Anexo: Detalhamento por Área", 14, currentYDetails);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkGray);
    doc.text("Visão detalhada de todos os itens validados na operação.", 14, currentYDetails + 5);
    currentYDetails += 12;

    appData.sections.forEach((section, index) => {
        if (section.items.length > 0) {
            const tableData = section.items.map(item => {
                const itemId = `${section.id}-${item}`;
                const isChecked = checkedItems[itemId] ? 'Sim' : 'Nao';
                return [item, isChecked];
            });

            autoTable(doc, {
                startY: currentYDetails,
                head: [[`${index + 1}. ${section.title}`, 'Status']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [17, 17, 17], textColor: [255, 255, 255], fontStyle: 'bold' },
                bodyStyles: { textColor: [75, 75, 75] },
                styles: { fontSize: 9, cellPadding: 4, lineColor: [220, 220, 220] },
                margin: { left: 14, right: 14 },
                didParseCell: function (data) {
                    if (data.column.index === 1 && data.cell.section === 'body') {
                        if (data.cell.raw === 'Sim') {
                            data.cell.styles.textColor = [17, 17, 17];
                            data.cell.styles.fontStyle = 'bold';
                        } else {
                            data.cell.styles.textColor = [150, 150, 150];
                        }
                    }
                }
            });

            currentYDetails = (doc as any).lastAutoTable.finalY + 12;

            const pageCount = doc.getNumberOfPages();
            for (let i = 2; i <= pageCount; i++) {
                doc.setPage(i);
                addFooter();
            }
            doc.setPage(pageCount);
        }
    });

    const safeClientName = meetingMeta.clientName ? meetingMeta.clientName.replace(/[^a-z0-9]/gi, '_') : 'Desconhecido';
    doc.save(`Reuniao-${safeClientName}-${meetingMeta.date}.pdf`);
};
