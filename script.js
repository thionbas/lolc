const { jsPDF } = window.jspdf;

let currentMode = 'single';

const btnSingle = document.getElementById('modeSingle');
const btnList = document.getElementById('modeList');
const divSingle = document.getElementById('inputSingle');
const divList = document.getElementById('inputList');

btnSingle.onclick = () => {
    currentMode = 'single';
    btnSingle.className = "flex-1 py-2 rounded font-bold transition bg-white shadow-sm border border-gray-300";
    btnList.className = "flex-1 py-2 rounded font-bold transition text-gray-500 hover:text-gray-700";
    divSingle.classList.remove('hidden');
    divList.classList.add('hidden');
    updatePreview();
};

btnList.onclick = () => {
    currentMode = 'list';
    btnList.className = "flex-1 py-2 rounded font-bold transition bg-white shadow-sm border border-gray-300";
    btnSingle.className = "flex-1 py-2 rounded font-bold transition text-gray-500 hover:text-gray-700";
    divList.classList.remove('hidden');
    divSingle.classList.add('hidden');
    updatePreview();
};

function updatePreview() {
    const statusType = document.getElementById('statusType').value;
    const textSize = document.getElementById('textSize').value;
    document.getElementById('fontSizeDisplay').innerText = textSize;

    let displayNum = "";
    if (currentMode === 'single') {
        displayNum = document.getElementById('idInput').value;
    } else {
        const lines = document.getElementById('listInput').value.split('\n');
        displayNum = lines[0] || "";
    }

    const pCard = document.getElementById('previewCard');
    const pText = document.getElementById('pText');

    // Zusammenfügen als ein einziger Textblock
    pText.innerText = `${statusType}-${displayNum}`;

    pCard.className = "label-canvas";
    if (statusType === "LO" || statusType === "NO") pCard.classList.add("color-lo");
    if (statusType === "LC" || statusType === "NC") pCard.classList.add("color-lc");
    if (statusType === "EA") pCard.classList.add("color-ea");

    const previewWidth = pCard.offsetWidth;
    const scaleFactor = previewWidth / 99.1;
    // pt zu px Umrechnung
    pText.style.fontSize = (textSize * 0.3527 * scaleFactor) + "px";
}

document.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('input', updatePreview));

document.getElementById('pdfBtn').onclick = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const statusType = document.getElementById('statusType').value;
    const textSize = parseInt(document.getElementById('textSize').value);
    
    const colors = {
        LO: { bg: [34, 197, 94], text: [0, 0, 0] },
        NO: { bg: [34, 197, 94], text: [0, 0, 0] },
        LC: { bg: [239, 68, 68], text: [255, 255, 255] },
        NC: { bg: [239, 68, 68], text: [255, 255, 255] },
        EA: { bg: [255, 255, 255], text: [0, 0, 0] }
    };
    const cfg = colors[statusType];

    const labelW = 99.1;
    const labelH = 42.3;
    const leftMargin = 6.4; 
    const topMargin = 21.6;

    let labelsToPrint = [];
    if (currentMode === 'single') {
        const val = document.getElementById('idInput').value;
        for (let i = 0; i < 12; i++) labelsToPrint.push(val);
    } else {
        const lines = document.getElementById('listInput').value.split('\n');
        for (let i = 0; i < 12; i++) labelsToPrint.push(lines[i] || "");
    }

    for (let i = 0; i < 12; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = leftMargin + (col * labelW);
        const y = topMargin + (row * labelH);
        
        const fullText = `${statusType}-${labelsToPrint[i]}`;

        doc.setFillColor(cfg.bg[0], cfg.bg[1], cfg.bg[2]);
        doc.rect(x, y, labelW, labelH, 'F');

        doc.setTextColor(cfg.text[0], cfg.text[1], cfg.text[2]);
        // Hier wird sichergestellt, dass Helvetica Bold für alles gilt
        doc.setFont("helvetica", "bold");
        doc.setFontSize(textSize * 1.8); // Skalierung für mm-Bereich

        doc.text(fullText, x + (labelW / 2), y + (labelH / 2), { 
            align: 'center', 
            baseline: 'middle'
        });
    }

    doc.save(`LOLC_Bogen_${statusType}.pdf`);
};

updatePreview();
