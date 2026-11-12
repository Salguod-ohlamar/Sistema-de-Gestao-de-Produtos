// Valida CPF pelos dígitos verificadores. Retorna só os 11 dígitos ou null se inválido.
export function normalizeCpf(value) {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return null;
    for (const length of [9, 10]) {
        let sum = 0;
        for (let i = 0; i < length; i++) sum += Number(digits[i]) * (length + 1 - i);
        const check = ((sum * 10) % 11) % 10;
        if (check !== Number(digits[length])) return null;
    }
    return digits;
}
