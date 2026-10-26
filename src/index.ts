import { validarCedula } from "./cedula";
import { validarRuc, type OpcionesRuc } from "./ruc";

export { analizarCedula, calcularDigitoCedula, validarCedula } from "./cedula";
export type { ErrorCedula, ResultadoCedula } from "./cedula";
export { analizarRuc, validarRuc } from "./ruc";
export type { ErrorRuc, OpcionesRuc, ResultadoRuc, TipoRuc } from "./ruc";
export { PROVINCIAS, obtenerProvincia } from "./provincias";
export { generarCedula, generarRuc } from "./generador";
export type { OpcionesGenerador, OpcionesGeneradorRuc } from "./generador";

/** Valida una identificación ecuatoriana: cédula (10 dígitos) o RUC (13 dígitos). */
export function validarIdentificacion(valor: string, opciones?: OpcionesRuc): boolean {
  return validarCedula(valor) || validarRuc(valor, opciones);
}
