const { jsPDF } = window.jspdf;

function updatePreview() {
    const statusType = document.getElementById('statusType').value;
    const idInput = document.getElementById('idInput').value || "XX-NN-NN";
    const textSize = document.getElementById('textSize').value;
    
    document.getElementById('textSizeDisplay').innerText = textSize;

    // Präfix Logik
    let prefix = statusType;
    if (statusType === "NC_ROT" || statusType === "NC_GRUEN") prefix = "NC";
    
    const fullText = `${prefix}-${idInput}`;
    const pCard = document.getElementById('previewCard');
    const pText = document.getElementById('pText');

    pText.innerText = fullText;

    // Farben in Vorschau umschalten
    pCard.className = "label-canvas";
    if (statusType === "LO") pCard.classList.add("color-lo");
    if (statusType === "LC") pCard.classList.add("color-lc");
    if (statusType === "NC_ROT") pCard.classList.add("color-nc-rot");
    if (statusType === "NC_GRUEN") pCard.classList.add("color-nc-gruen");
    if (statusType === "EA") pCard.classList.add("color-ea");

    // Vorschau Schriftgröße (px-Umrechnung)
    const previewWidth = pCard.offsetWidth;
    const scaleFactor = previewWidth / 99.1;
    pText.style.fontSize = (textSize * 0.3527 * scaleFactor) + "px";
}

document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updatePreview));

document.getElementById('pdfBtn').onclick = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const statusType = document.getElementById('statusType').value;
    const idInput = document.getElementById('idInput').value || "XX-NN-NN";
    const textSize = parseInt(document.getElementById('textSize').value);

    let prefix = statusType;
    if (statusType === "NC_ROT" || statusType === "NC_GRUEN") prefix = "NC";
    const fullText = `${prefix}-${idInput}`;

    // PDF Farb-Konfiguration
    const colors = {
        LO: { bg: [34, 197, 94], text: [0, 0, 0] },
        LC: { bg: [239, 68, 68], text: [255, 255, 255] },
        NC_ROT: { bg: [239, 68, 68], text: [255, 255, 255] },
        NC_GRUEN: { bg: [34, 197, 94], text: [0, 0, 0] },
        EA: { bg: [255, 255, 255], text: [0, 0, 0] }
    };

    const cfg = colors[statusType];

    // Avery Zweckform 12er Bogen (L4743REV) Parameter
    const labelW = 99.1;
    const labelH = 42.3;
    const leftMargin = 5.9;
    const topMargin = 21.6;

    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 2; c++) {
            const x = leftMargin + (c * labelW);
            const y = topMargin + (r * labelH);

            // Hintergrund
            doc.setFillColor(cfg.bg[0], cfg.bg[1], cfg.bg[2]);
            doc.rect(x, y, labelW, labelH, 'F');

            // Textfarbe & Schrift
            doc.setTextColor(cfg.text[0], cfg.text[1], cfg.text[2]);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(textSize * 2.8); // Skalierung für mm

            // Text exakt zentriert im Etikett
            doc.text(fullText, x + (labelW / 2), y + (labelH / 2), { 
                align: 'center', 
                baseline: 'middle',
                maxWidth: labelW - 10 
            });
        }
    }

    doc.save(`LOLC_Bogen_${fullText}.pdf`);
};

// Startzustand laden
updatePreview();
