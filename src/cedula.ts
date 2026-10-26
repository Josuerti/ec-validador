import { obtenerProvincia } from "./provincias";
import { aDigitos, normalizar } from "./utils";

export type ErrorCedula =
  | "FORMATO_INVALIDO"
  | "PROVINCIA_INVALIDA"
  | "TERCER_DIGITO_INVALIDO"
  | "DIGITO_VERIFICADOR_INVALIDO";

export type ResultadoCedula =
  | { valido: true; cedula: string; provincia: string }
  | { valido: false; error: ErrorCedula };

const COEFICIENTES = [2, 1, 2, 1, 2, 1, 2, 1, 2];

/** Calcula el dígito verificador (módulo 10) a partir de los 9 primeros dígitos. */
export function calcularDigitoCedula(nueveDigitos: string): number {
  const suma = aDigitos(nueveDigitos).reduce((acc, d, i) => {
    const producto = d * COEFICIENTES[i];
    return acc + (producto > 9 ? producto - 9 : producto);
  }, 0);
  return (10 - (suma % 10)) % 10;
}

/** Valida una cédula y explica el motivo si no es válida. */
export function analizarCedula(valor: string): ResultadoCedula {
  const cedula = normalizar(valor);

  if (!/^\d{10}$/.test(cedula)) return { valido: false, error: "FORMATO_INVALIDO" };

  const provincia = obtenerProvincia(cedula.slice(0, 2));
  if (!provincia) return { valido: false, error: "PROVINCIA_INVALIDA" };

  if (Number(cedula[2]) > 5) return { valido: false, error: "TERCER_DIGITO_INVALIDO" };

  if (calcularDigitoCedula(cedula.slice(0, 9)) !== Number(cedula[9])) {
    return { valido: false, error: "DIGITO_VERIFICADOR_INVALIDO" };
  }

  return { valido: true, cedula, provincia };
}

/** Devuelve `true` si la cédula ecuatoriana es válida. */
export function validarCedula(valor: string): boolean {
  return analizarCedula(valor).valido;
}
