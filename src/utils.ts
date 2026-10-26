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
