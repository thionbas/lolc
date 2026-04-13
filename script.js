const { jsPDF } = window.jspdf;

function updatePreview() {
    const statusType = document.getElementById('statusType').value;
    const mainText = document.getElementById('mainText').value;
    const textSize = document.getElementById('textSize').value;
    
    document.getElementById('fontSizeDisplay').innerText = textSize;

    const pCard = document.getElementById('previewCard');
    const pText = document.getElementById('pText');

    // Text zusammensetzen (Präfix + Bindestrich + Nutzertext)
    pText.innerText = `${statusType}-${mainText}`;

    // Farben umschalten
    pCard.className = "label-canvas";
    if (statusType === "LO" || statusType === "NO") pCard.classList.add("color-lo");
    if (statusType === "LC" || statusType === "NC") pCard.classList.add("color-lc");
    if (statusType === "EA") pCard.classList.add("color-ea");

    // Vorschau Schriftgröße anpassen
    const previewWidth = pCard.offsetWidth;
    const scaleFactor = previewWidth / 99.1;
    // pt zu px Umrechnung für den Browser
    pText.style.fontSize = (textSize * 0.3527 * scaleFactor) + "px";
}

// Event-Listener für Eingaben
document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updatePreview));

document.getElementById('pdfBtn').onclick = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const statusType = document.getElementById('statusType').value;
    const mainText = document.getElementById('mainText').value;
    const textSize = parseInt(document.getElementById('textSize').value);
    const fullText = `${statusType}-${mainText}`;

    // PDF Farb-Konfiguration
    const colors = {
        LO: { bg: [34, 197, 94], text: [0, 0, 0] },
        NO: { bg: [34, 197, 94], text: [0, 0, 0] },
        LC: { bg: [239, 68, 68], text: [255, 255, 255] },
        NC: { bg: [239, 68, 68], text: [255, 255, 255] },
        EA: { bg: [255, 255, 255], text: [0, 0, 0] }
    };

    const cfg = colors[statusType];

    // Avery Zweckform 12er Bogen Parameter
    const labelW = 99.1;
    const labelH = 42.3;
    const leftMargin = 6.4; 
    const topMargin = 21.6;

    for (let i = 0; i < 12; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        
        const x = leftMargin + (col * labelW);
        const y = topMargin + (row * labelH);

        // Hintergrund
        doc.setFillColor(cfg.bg[0], cfg.bg[1], cfg.bg[2]);
        doc.rect(x, y, labelW, labelH, 'F');

        // Text
        doc.setTextColor(cfg.text[0], cfg.text[1], cfg.text[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(textSize);

        // Exakt zentriert
        doc.text(fullText, x + (labelW / 2), y + (labelH / 2), { 
            align: 'center', 
            baseline: 'middle',
            maxWidth: labelW - 10 
        });
    }

    doc.save(`LOLC_${fullText}.pdf`);
};

// Initialisierung
updatePreview();
