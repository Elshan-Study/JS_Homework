const form = document.getElementById('addForm');
const nameInput = document.getElementById('name');
const valueInput = document.getElementById('value');
const clearBtn = document.getElementById('clearBtn');
const errorEl = document.getElementById('error');
const paletteEl = document.getElementById('palette');

const infoPanel = document.getElementById('infoPanel');
const infoSwatch = document.getElementById('infoSwatch');
const infoName = document.getElementById('infoName');
const infoInput = document.getElementById('infoInput');
const infoType = document.getElementById('infoType');

let colors = loadColors();
let selectedIndex = -1;

const nameRegex = /^\p{L}+$/u;
const hexRegex = /^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i;

function showError(msg) {
    errorEl.style.display = 'block';
    errorEl.textContent = msg;
}
function clearError() {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
}

function validateName(raw) {
    if (!raw) return { ok: false, reason: 'Название не может быть пустым' };
    const trimmed = raw.trim();
    if (!nameRegex.test(trimmed)) return { ok: false, reason: 'Название: только буквы, без пробелов и цифр' };
    return { ok: true, normalized: trimmed.toLowerCase(), display: trimmed };
}

function expandHexShort(hex) {
    return hex.split('').map(c => c + c).join('');
}

function hexToRgbaForCss(hex) {
    let h = hex;
    if (h.length === 3 || h.length === 4) h = expandHexShort(h);
    if (h.length === 6) {
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        return `rgb(${r}, ${g}, ${b})`;
    } else if (h.length === 8) {
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        const a = parseInt(h.slice(6, 8), 16) / 255;
        const aTrim = Math.round(a * 1000) / 1000;
        return `rgba(${r}, ${g}, ${b}, ${aTrim})`;
    }
    return null;
}

function normalizeColor(raw) {
    if (!raw) return { ok: false, reason: 'Пустое значение цвета' };
    const v = raw.trim();

    const hexMatch = v.match(hexRegex);
    if (hexMatch) {
        const h = hexMatch[1].toLowerCase();
        const inputWithHash = '#' + h;
        const css = (h.length === 4 || h.length === 8) ? hexToRgbaForCss(h) : '#' + h;
        return { ok: true, type: 'HEX', input: inputWithHash, css };
    }

    const rM = v.match(rgbaRegex);
    if (rM) {
        const r = Number(rM[1]), g = Number(rM[2]), b = Number(rM[3]), a = Number(rM[4]);
        if ([r, g, b].some(n => n < 0 || n > 255)) return { ok: false, reason: 'RGB значения: 0–255' };
        if (a < 0 || a > 1) return { ok: false, reason: 'Альфа должен быть между 0 и 1' };
        const input = `rgba(${r}, ${g}, ${b}, ${a})`;
        return { ok: true, type: 'RGBA', input, css: input };
    }

    const rM2 = v.match(rgbRegex);
    if (rM2) {
        const r = Number(rM2[1]), g = Number(rM2[2]), b = Number(rM2[3]);
        if ([r, g, b].some(n => n < 0 || n > 255)) return { ok: false, reason: 'RGB значения: 0–255' };
        const input = `rgb(${r}, ${g}, ${b})`;
        return { ok: true, type: 'RGB', input, css: input };
    }

    return { ok: false, reason: 'Неверный формат: используйте HEX (#RGB/#RRGGBB/#RGBA/#RRGGBBAA) или rgb()/rgba()' };
}

function saveColors() {
    try {
        localStorage.setItem('colors_palette_v1', JSON.stringify(colors));
    } catch (e) {
        console.warn('Не удалось сохранить в localStorage', e);
    }
}
function loadColors() {
    try {
        const raw = localStorage.getItem('colors_palette_v1');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch (e) {
        return [];
    }
}

function renderPalette() {
    paletteEl.innerHTML = '';
    if (colors.length === 0) {
        const note = document.createElement('div');
        note.className = 'small';
        note.textContent = 'Пока нет добавленных цветов — добавьте новый цвет в форме выше.';
        paletteEl.appendChild(note);
        hideInfo();
        return;
    }

    colors.forEach((c, idx) => {
        const tile = createTile(c, idx);
        paletteEl.appendChild(tile);
    });
}

function createTile(colorObj, idx) {
    const btn = document.createElement('button');
    btn.className = 'tile';
    btn.type = 'button';
    btn.setAttribute('data-index', String(idx));
    btn.setAttribute('aria-label', `${colorObj.displayName} — ${colorObj.inputValue} — ${colorObj.type}`);
    btn.title = `${colorObj.displayName} — ${colorObj.inputValue} — ${colorObj.type}`;

    const inner = document.createElement('div');
    inner.className = 'tile-inner';
    inner.style.background = colorObj.css;
    const labelNode = document.createElement('span');
    labelNode.textContent = colorObj.displayName.slice(0, 1).toUpperCase();
    inner.appendChild(labelNode);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = colorObj.displayName;
    nameSpan.style.textTransform = 'capitalize';
    const typeSpan = document.createElement('span');
    typeSpan.textContent = colorObj.type;
    meta.appendChild(nameSpan);
    meta.appendChild(typeSpan);

    btn.appendChild(inner);
    btn.appendChild(meta);

    if (idx === selectedIndex) btn.classList.add('selected');

    btn.addEventListener('click', () => selectColor(idx));

    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectColor(idx);
        }
    });

    return btn;
}

function selectColor(index) {
    if (index < 0 || index >= colors.length) {
        selectedIndex = -1;
        unsetSelectedUI();
        hideInfo();
        return;
    }
    selectedIndex = index;
    unsetSelectedUI();
    const tile = paletteEl.querySelector(`.tile[data-index="${index}"]`);
    if (tile) tile.classList.add('selected');

    const c = colors[index];
    showInfo(c);
}

function unsetSelectedUI() {
    const selected = paletteEl.querySelectorAll('.tile.selected');
    selected.forEach(s => s.classList.remove('selected'));
}

function showInfo(c) {
    infoSwatch.style.background = c.css;
    infoName.textContent = c.displayName;
    infoInput.textContent = c.inputValue;
    infoType.textContent = c.type;
    infoPanel.hidden = false;
}

function hideInfo() {
    infoPanel.hidden = true;
}

function addColorFromForm() {
    clearError();
    const nameRaw = nameInput.value;
    const valRaw = valueInput.value;

    const nameCheck = validateName(nameRaw);
    if (!nameCheck.ok) {
        showError(nameCheck.reason);
        return false;
    }

    if (colors.some(c => c.name === nameCheck.normalized)) {
        showError('Цвет с таким названием уже существует (регистр не учитывается).');
        return false;
    }

    const norm = normalizeColor(valRaw);
    if (!norm.ok) {
        showError(norm.reason);
        return false;
    }

    const colorEntry = {
        name: nameCheck.normalized,
        displayName: nameCheck.display,
        inputValue: norm.input,
        type: norm.type,
        css: norm.css
    };

    colors.push(colorEntry);
    saveColors();
    renderPalette();
    selectColor(colors.length - 1);

    form.reset();
    nameInput.focus();
    return true;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    addColorFromForm();
});

clearBtn.addEventListener('click', function () {
    form.reset();
    clearError();
    nameInput.focus();
});


renderPalette();