// Mapeamento dos inputs
const inputs = {
    dec: document.getElementById('dec'),
    bin: document.getElementById('bin'),
    oct: document.getElementById('oct'),
    hex: document.getElementById('hex')
};

// Expressões regulares para validar cada base
const validators = {
    dec: /^[0-9]+$/,
    bin: /^[01]+$/,
    oct: /^[0-7]+$/,
    hex: /^[0-9A-Fa-f]+$/
};

// Função para mostrar ou ocultar erros
function toggleError(base, show) {
    const errorMsg = document.getElementById(`err-${base}`);
    if (show) {
        inputs[base].classList.add('invalid');
        errorMsg.style.display = 'block';
    } else {
        inputs[base].classList.remove('invalid');
        errorMsg.style.display = 'none';
    }
}

// Função para limpar todos os campos
function clearAll() {
    Object.keys(inputs).forEach(key => {
        inputs[key].value = '';
        toggleError(key, false);
    });
}

// Lógica principal de conversão
function converterLogica(sourceBase, value) {
    if (value === '') {
        clearAll();
        return;
    }

    if (!validators[sourceBase].test(value)) {
        toggleError(sourceBase, true);
        return;
    } else {
        toggleError(sourceBase, false);
    }

    let radix;
    switch(sourceBase) {
        case 'dec': radix = 10; break;
        case 'bin': radix = 2; break;
        case 'oct': radix = 8; break;
        case 'hex': radix = 16; break;
    }

    let decimalValue;
    try {
        const cleanValue = value.trim().toUpperCase(); 
        decimalValue = [...cleanValue].reduce((acc, char) => {
            const digit = parseInt(char, radix);
            return acc * BigInt(radix) + BigInt(digit);
        }, BigInt(0));
    } catch (e) {
        return; 
    }

    if (sourceBase !== 'dec') inputs.dec.value = decimalValue.toString(10);
    if (sourceBase !== 'bin') inputs.bin.value = decimalValue.toString(2);
    if (sourceBase !== 'oct') inputs.oct.value = decimalValue.toString(8);
    if (sourceBase !== 'hex') inputs.hex.value = decimalValue.toString(16).toUpperCase();
}

// Adiciona os event listeners de digitação (input) para cada campo
Object.keys(inputs).forEach(base => {
    inputs[base].addEventListener('input', (e) => {
        converterLogica(base, e.target.value);
    });
});

// FUNÇÃO EXTRA: Copiar para área de transferência
function copyToClipboard(baseId) {
    const inputEl = document.getElementById(baseId);
    if (!inputEl || inputEl.value === '') return;
    
    navigator.clipboard.writeText(inputEl.value)
        .then(() => {

// Feedback visual rápido no botão de copiar
            const btn = inputEl.previousElementSibling.querySelector('.btn-copy');
            const originalText = btn.innerText;
            btn.innerText = '✅';
            setTimeout(() => {
                btn.innerText = originalText;
            }, 1000);
        })
        .catch(err => {
            console.error('Erro ao copiar text: ', err);
        });
}
