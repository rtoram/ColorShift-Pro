const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const downloadBtn = document.getElementById('downloadBtn');
const colorPreview = document.getElementById('colorPreview');
const colorInput = document.getElementById('colorInput');
const applyColorBtn = document.getElementById('applyColorBtn');

let img = new Image();
let selectedColor = null; // Armazena a cor selecionada em RGB

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
    selectedColor = { r: pixel[0], g: pixel[1], b: pixel[2] }; // Armazena como objeto RGB
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    colorPreview.style.backgroundColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    colorInput.value = hex;
    console.log('Cor selecionada:', selectedColor); // Para debug
});

// Converter RGB para HEX
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Converter HEX para RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// Aplicar nova cor
applyColorBtn.addEventListener('click', () => {
    if (!selectedColor || !colorInput.value) {
        alert('Selecione uma cor da imagem e insira uma nova cor no campo!');
        return;
    }

    const newColor = hexToRgb(colorInput.value); // Cor nova em RGB
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    console.log('Nova cor:', newColor); // Para debug

    // Substituir todos os pixels da cor selecionada
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Comparar com a cor selecionada
        if (r === selectedColor.r && g === selectedColor.g && b === selectedColor.b) {
            data[i] = newColor.r;     // Novo vermelho
            data[i + 1] = newColor.g; // Novo verde
            data[i + 2] = newColor.b; // Novo azul
        }
    }

    // Atualizar o canvas com a nova imagem
    ctx.putImageData(imageData, 0, 0);
});

// Download da imagem editada
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
