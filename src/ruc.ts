import { analizarCedula } from "./cedula";
import { obtenerProvincia } from "./provincias";
import { aDigitos, normalizar, sumaPonderada } from "./utils";

export type TipoRuc = "natural" | "privada" | "publica";

export type ErrorRuc =
  | "FORMATO_INVALIDO"
  | "PROVINCIA_INVALIDA"
  | "TERCER_DIGITO_INVALIDO"
  | "DIGITO_VERIFICADOR_INVALIDO"
  | "ESTABLECIMIENTO_INVALIDO";

export type ResultadoRuc =
  | { valido: true; ruc: string; tipo: TipoRuc; provincia: string; establecimiento: string }
  | { valido: false; error: ErrorRuc };

export interface OpcionesRuc {
  /**
   * Verifica el dígito verificador (módulo 11) en RUC de sociedades.
   * El SRI ha emitido RUC de sociedades que no cumplen esta regla, así que
   * puedes desactivarla para no rechazar RUC reales. Por defecto: `true`.
   */
  verificarDigitoSociedades?: boolean;
}

const COEF_PRIVADA = [4, 3, 2, 7, 6, 5, 4, 3, 2];
const COEF_PUBLICA = [3, 2, 7, 6, 5, 4, 3, 2];

/** Módulo 11: devuelve el dígito esperado, o `null` si el resultado es 10 (imposible). */
function modulo11(digitos: number[], coeficientes: number[]): number | null {
  const resto = sumaPonderada(digitos, coeficientes) % 11;
  const digito = resto === 0 ? 0 : 11 - resto;
  return digito === 10 ? null : digito;
}

function tipoDeRuc(tercerDigito: number): TipoRuc | null {
  if (tercerDigito <= 5) return "natural";
  if (tercerDigito === 6) return "publica";
  if (tercerDigito === 9) return "privada";
  return null;
}

/** Valida un RUC, identifica su tipo y explica el motivo si no es válido. */
export function analizarRuc(valor: string, opciones: OpcionesRuc = {}): ResultadoRuc {
  const { verificarDigitoSociedades = true } = opciones;
  const ruc = normalizar(valor);

  if (!/^\d{13}$/.test(ruc)) return { valido: false, error: "FORMATO_INVALIDO" };

  const provincia = obtenerProvincia(ruc.slice(0, 2));
  if (!provincia) return { valido: false, error: "PROVINCIA_INVALIDA" };

  const tipo = tipoDeRuc(Number(ruc[2]));
  if (!tipo) return { valido: false, error: "TERCER_DIGITO_INVALIDO" };

  const digitos = aDigitos(ruc);

  if (tipo === "natural") {
    const cedula = analizarCedula(ruc.slice(0, 10));
    if (!cedula.valido) return { valido: false, error: cedula.error };
  } else if (verificarDigitoSociedades) {
    const esPublica = tipo === "publica";
    const esperado = modulo11(digitos, esPublica ? COEF_PUBLICA : COEF_PRIVADA);
    const real = digitos[esPublica ? 8 : 9];
    if (esperado !== real) return { valido: false, error: "DIGITO_VERIFICADOR_INVALIDO" };
  }

  // Las entidades públicas usan 4 dígitos de establecimiento; el resto, 3.
  const establecimiento = ruc.slice(tipo === "publica" ? 9 : 10);
  if (Number(establecimiento) === 0) return { valido: false, error: "ESTABLECIMIENTO_INVALIDO" };

  return { valido: true, ruc, tipo, provincia, establecimiento };
}

/** Devuelve `true` si el RUC ecuatoriano es válido. */
export function validarRuc(valor: string, opciones?: OpcionesRuc): boolean {
  return analizarRuc(valor, opciones).valido;
}
