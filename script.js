const { jsPDF } = window.jspdf;

function updatePreview() {
    const statusType = document.getElementById('statusType').value;
    const idInput = document.getElementById('idInput').value || "XX-XX-XX";
    const textSize = document.getElementById('textSize').value;
    
    document.getElementById('textSizeDisplay').innerText = textSize;

    let prefix = statusType;
    if (statusType === "NC_ROT" || statusType === "NC_GRUEN") prefix = "NC";
    
    const fullText = `${prefix}-${idInput}`;
    const pCard = document.getElementById('previewCard');
    const pText = document.getElementById('pText');

    pText.innerText = fullText;

    pCard.className = "label-canvas";
    if (statusType === "LO") pCard.classList.add("color-lo");
    if (statusType === "LC") pCard.classList.add("color-lc");
    if (statusType === "NC_ROT") pCard.classList.add("color-nc-rot");
    if (statusType === "NC_GRUEN") pCard.classList.add("color-nc-gruen");
    if (statusType === "EA") pCard.classList.add("color-ea");

    const previewWidth = pCard.offsetWidth;
    const scaleFactor = previewWidth / 99.1;
    pText.style.fontSize = (textSize * 0.3527 * scaleFactor) + "px";
}

document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updatePreview));

document.getElementById('pdfBtn').onclick = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const statusType = document.getElementById('statusType').value;
    const idInput = document.getElementById('idInput').value || "XX-XX-XX";
    const textSize = parseInt(document.getElementById('textSize').value);

    let prefix = statusType;
    if (statusType === "NC_ROT" || statusType === "NC_GRUEN") prefix = "NC";
    const fullText = `${prefix}-${idInput}`;

    const colors = {
        LO: { bg: [34, 197, 94], text: [0, 0, 0] },
        LC: { bg: [239, 68, 68], text: [255, 255, 255] },
        NC_ROT: { bg: [239, 68, 68], text: [255, 255, 255] },
        NC_GRUEN: { bg: [34, 197, 94], text: [0, 0, 0] },
        EA: { bg: [255, 255, 255], text: [0, 0, 0] }
    };

    const cfg = colors[statusType];

    // Exakte Avery L4743REV Abstände (wie in /schilder)
    const labelW = 99.1;
    const labelH = 42.3;
    const leftMargin = 6.4; // Exakter Wert aus deiner schilder-App
    const topMargin = 21.6;

    for (let i = 0; i < 12; i++) {
        const x = leftMargin + (i % 2 * labelW);
        const y = topMargin + (Math.floor(i / 2) * labelH);

        // Hintergrund
        doc.setFillColor(cfg.bg[0], cfg.bg[1], cfg.bg[2]);
        doc.rect(x, y, labelW, labelH, 'F');

        // Text
        doc.setTextColor(cfg.text[0], cfg.text[1], cfg.text[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(textSize); 

        doc.text(fullText, x + (labelW / 2), y + (labelH / 2), { 
            align: 'center', 
            baseline: 'middle'
        });
    }

    doc.save(`LOLC_${fullText}.pdf`);
};

updatePreview();
