document.addEventListener('DOMContentLoaded', function () {
    const range = document.getElementById('fontRange');
    const valueLabel = document.getElementById('fontValue');

    function applyFontSize(px) {
        document.documentElement.style.fontSize = px + 'px';
        valueLabel.textContent = px + 'px';
    }

    applyFontSize(range.value);
    range.addEventListener('input', function (e) {
        applyFontSize(e.target.value);
    });

    // ====== Калькулятор ======
    const exprEl = document.getElementById('expr');
    const resEl = document.getElementById('res');
    const keys = document.querySelectorAll('.keys button');

    let expression = '';

    function updateView() {
        exprEl.textContent = expression || '\u00A0';
        try {
            const preview = previewEval(expression);
            resEl.textContent = preview === '' ? '0' : preview;
        } catch (err) {
            resEl.textContent = expression ? '...' : '0';
        }
    }

    function previewEval(expr) {
        if (!expr) return '';
        let e = expr.replace(/[×÷]/g, function(m){ return m === '×' ? '*' : '/'; });
        while (e.length && /[+\-*/.]$/.test(e)) e = e.slice(0, -1);
        if (!e) return '';
        if (!/^[0-9+\-*/().\s]+$/.test(e)) throw new Error('invalid chars');
        const result = Function('"use strict";return (' + e + ')')();
        if (!isFinite(result)) throw new Error('math error');
        return formatNum(result);
    }

    function formatNum(n) {
        if (Math.abs(n - Math.round(n)) < 1e-12) return String(Math.round(n));
        return parseFloat(n.toFixed(12)).toString();
    }

    function appendValue(v) {
        if (v === '×' || v === '÷') {
            v = v === '×' ? '*' : '/';
        }
        const ops = ['+','-','*','/'];
        const last = expression.slice(-1);
        if (ops.includes(v)) {
            if (expression === '' && v !== '-') return;
            if (ops.includes(last)) {
                if (v === '-' && last !== '-') {
                    expression += v;
                } else {
                    expression = expression.slice(0, -1) + v;
                }
                updateView();
                return;
            }
        }
        if (v === '.') {
            const token = expression.match(/([0-9]*\.?[0-9]*)$/);
            if (token && token[0].includes('.')) return;
            if (!token || token[0] === '') v = '0.';
        }
        expression += v;
        updateView();
    }

    function clearAll() {
        expression = '';
        updateView();
    }
    function backspace() {
        expression = expression.slice(0, -1);
        updateView();
    }
    function evaluate() {
        try {
            const r = previewEval(expression);
            expression = r === '' ? '' : String(r);
            updateView();
        } catch (e) {
            resEl.textContent = 'Error';
        }
    }

    keys.forEach(btn => {
        btn.addEventListener('click', () => {
            const v = btn.getAttribute('data-value');
            const action = btn.getAttribute('data-action');
            if (action) {
                if (action === 'clear') clearAll();
                if (action === 'back') backspace();
                if (action === 'equals') evaluate();
            } else if (v) {
                appendValue(v);
            }
        });
    });

    window.addEventListener('keydown', (ev) => {
        const k = ev.key;
        if (/^[0-9]$/.test(k) || k === '.') { appendValue(k); ev.preventDefault(); return; }
        if (k === '+' || k === '-' || k === '*' || k === '/') { appendValue(k); ev.preventDefault(); return; }
        if (k === 'Enter' || k === '=') { evaluate(); ev.preventDefault(); return; }
        if (k === 'Backspace') { backspace(); ev.preventDefault(); return; }
        if (k === 'Escape') { clearAll(); ev.preventDefault(); return; }
        if (k === '(' || k === ')') { appendValue(k); ev.preventDefault();}
    });

    updateView();
});
