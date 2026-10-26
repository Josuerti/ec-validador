/** Quita espacios y guiones para aceptar entradas como "171003406-5". */
export function normalizar(valor: string): string {
  return String(valor ?? "").replace(/[\s-]/g, "");
}

export function aDigitos(valor: string): number[] {
  return valor.split("").map(Number);
}

/** Suma ponderada de los primeros `coeficientes.length` dígitos. */
export function sumaPonderada(digitos: number[], coeficientes: number[]): number {
  return coeficientes.reduce((suma, coef, i) => suma + digitos[i] * coef, 0);
}

/** Módulo 11: devuelve el dígito esperado, o `null` si el resultado es 10 (imposible). */
export function modulo11(digitos: number[], coeficientes: number[]): number | null {
  const resto = sumaPonderada(digitos, coeficientes) % 11;
  const digito = resto === 0 ? 0 : 11 - resto;
  return digito === 10 ? null : digito;
}
