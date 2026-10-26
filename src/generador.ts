import { calcularDigitoCedula } from "./cedula";
import { PROVINCIAS } from "./provincias";
import { COEF_PRIVADA, COEF_PUBLICA, type TipoRuc } from "./ruc";
import { aDigitos, modulo11 } from "./utils";

export interface OpcionesGenerador {
  /** Código de provincia de dos dígitos, por ejemplo `"17"`. Por defecto: aleatorio. */
  provincia?: string;
  /** Fuente de números en [0, 1). Pásala para obtener resultados reproducibles en tus pruebas. */
  aleatorio?: () => number;
}

export interface OpcionesGeneradorRuc extends OpcionesGenerador {
  /** Tipo de RUC a generar. Por defecto: `"natural"`. */
  tipo?: TipoRuc;
}

const CODIGOS = Object.keys(PROVINCIAS);

function entero(aleatorio: () => number, max: number): number {
  return Math.floor(aleatorio() * max);
}

function digitosAleatorios(aleatorio: () => number, cantidad: number): string {
  return Array.from({ length: cantidad }, () => entero(aleatorio, 10)).join("");
}

function elegirProvincia({ provincia, aleatorio = Math.random }: OpcionesGenerador): string {
  if (provincia === undefined) return CODIGOS[entero(aleatorio, CODIGOS.length)];
  if (!(provincia in PROVINCIAS)) throw new RangeError(`Código de provincia inválido: ${provincia}`);
  return provincia;
}

/**
 * Genera una cédula ficticia que pasa la validación. Sirve para pruebas y datos
 * de ejemplo; el número no se verifica contra el Registro Civil.
 */
export function generarCedula(opciones: OpcionesGenerador = {}): string {
  const { aleatorio = Math.random } = opciones;
  const base = elegirProvincia(opciones) + entero(aleatorio, 6) + digitosAleatorios(aleatorio, 6);
  return base + calcularDigitoCedula(base);
}

/** Genera un RUC ficticio que pasa la validación, del tipo indicado. */
export function generarRuc(opciones: OpcionesGeneradorRuc = {}): string {
  const { tipo = "natural", aleatorio = Math.random } = opciones;
  if (tipo === "natural") return generarCedula(opciones) + "001";

  const esPublica = tipo === "publica";
  const provincia = elegirProvincia(opciones);
  // Algunas bases dan 10 en el módulo 11 (sin dígito posible): se vuelve a intentar.
  for (;;) {
    const base = provincia + (esPublica ? "6" : "9") + digitosAleatorios(aleatorio, esPublica ? 5 : 6);
    const digito = modulo11(aDigitos(base), esPublica ? COEF_PUBLICA : COEF_PRIVADA);
    if (digito !== null) return base + digito + (esPublica ? "0001" : "001");
  }
}
