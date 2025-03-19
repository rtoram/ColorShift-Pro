const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const downloadBtn = document.getElementById('downloadBtn');
const colorPreview = document.getElementById('colorPreview');
const colorInput = document.getElementById('colorInput');
const applyColorBtn = document.getElementById('applyColorBtn');

let img = new Image();
let selectedColor = null;

// Upload da imagem
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            img.src = event.target.result;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                downloadBtn.disabled = false;
                applyColorBtn.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }
});

// Conta-gotas (selecionar cor da imagem)
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    selectedColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    colorPreview.style.backgroundColor = selectedColor;
    colorInput.value = hex;
});

// Converter RGB para HEX
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Aplicar nova cor
applyColorBtn.addEventListener('click', () => {
    if (!selectedColor || !colorInput.value) return;
    const newColor = hexToRgb(colorInput.value);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i] === hexToRgb(selectedColor).r &&
            data[i + 1] === hexToRgb(selectedColor).g &&
            data[i + 2] === hexToRgb(selectedColor).b) {
            data[i] = newColor.r;
            data[i + 1] = newColor.g;
            data[i + 2] = newColor.b;
        }
    }
    ctx.putImageData(imageData, 0, 0);
});

// Converter HEX para RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// Download da imagem editada
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
