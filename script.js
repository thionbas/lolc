const { jsPDF } = window.jspdf;

function updatePreview() {
    const statusType = document.getElementById('statusType').value;
    const idInput = document.getElementById('idInput').value;
    const textSize = document.getElementById('textSize').value;
    
    document.getElementById('textSizeDisplay').innerText = textSize;

    // Präfix bestimmen
    let prefix = statusType;
    if (statusType === "NC_ROT" || statusType === "NC_GRUEN") prefix = "NC";
    
    const fullText = `${prefix}-${idInput}`;
    const pCard = document.getElementById('previewCard');
    const pText = document.getElementById('pText');

    // Text setzen
    pText.innerText = fullText;

    // Klassen für Farben setzen
    pCard.className = "label-canvas"; // Reset
    if (statusType === "LO") pCard.classList.add("color-lo");
    if (statusType === "LC") pCard.classList.add("color-lc");
    if (statusType === "NC_ROT") pCard.classList.add("color-nc-rot");
    if (statusType === "NC_GRUEN") pCard.classList.add("color-nc-gruen");
    if (statusType === "EA") pCard.classList.add("color-ea");

    // Schriftgröße skalieren für Vorschau
    const previewWidth = pCard.offsetWidth;
    const scaleFactor = previewWidth / 297;
    pText.style.fontSize = (textSize * 0.3527 * scaleFactor) + "px";
}

document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updatePreview));

document.getElementById('pdfBtn').onclick = () => {
    const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
    
    const statusType = document.getElementById('statusType').value;
    const idInput = document.getElementById('idInput').value;
    const textSize = parseInt(document.getElementById('textSize').value);

    let prefix = statusType;
    if (statusType === "NC_ROT" || statusType === "NC_GRUEN") prefix = "NC";
    const fullText = `${prefix}-${idInput}`;

    // Hintergrundfarben definieren
    const colors = {
        LO: { bg: [34, 197, 94], text: [0, 0, 0] },
        LC: { bg: [239, 68, 68], text: [255, 255, 255] },
        NC_ROT: { bg: [239, 68, 68], text: [255, 255, 255] },
        NC_GRUEN: { bg: [34, 197, 94], text: [0, 0, 0] },
        EA: { bg: [255, 255, 255], text: [0, 0, 0] }
    };

    const config = colors[statusType];

    // Hintergrund zeichnen
    doc.setFillColor(config.bg[0], config.bg[1], config.bg[2]);
    doc.rect(0, 0, 297, 210, 'F');

    // Text zeichnen
    doc.setTextColor(config.text[0], config.text[1], config.text[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(textSize);
    
    // Zentriert auf dem Blatt
    doc.text(fullText, 148.5, 105, { align: 'center', baseline: 'middle', maxWidth: 280 });

    doc.save(`LOLC_${fullText}.pdf`);
};

// Initialer Aufruf
updatePreview();
