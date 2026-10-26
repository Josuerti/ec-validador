import { describe, expect, it } from "vitest";
import { analizarCedula, calcularDigitoCedula, validarCedula } from "../src";

describe("validarCedula", () => {
  it("acepta una cédula válida", () => {
    expect(validarCedula("1710034065")).toBe(true);
  });

  it("acepta espacios y guiones", () => {
    expect(validarCedula("171003406-5")).toBe(true);
    expect(validarCedula(" 1710034065 ")).toBe(true);
  });

  it.each([
    ["", "FORMATO_INVALIDO"],
    ["171003406", "FORMATO_INVALIDO"],
    ["17100340655", "FORMATO_INVALIDO"],
    ["17100340A5", "FORMATO_INVALIDO"],
    ["2510034065", "PROVINCIA_INVALIDA"],
    ["0010034065", "PROVINCIA_INVALIDA"],
    ["1760034065", "TERCER_DIGITO_INVALIDO"],
    ["1710034064", "DIGITO_VERIFICADOR_INVALIDO"],
  ])("rechaza %s con %s", (cedula, error) => {
    expect(analizarCedula(cedula)).toEqual({ valido: false, error });
  });

  it("devuelve la provincia", () => {
    expect(analizarCedula("1710034065")).toEqual({
      valido: true,
      cedula: "1710034065",
      provincia: "Pichincha",
    });
  });
});

describe("calcularDigitoCedula", () => {
  it("calcula el dígito verificador", () => {
    expect(calcularDigitoCedula("171003406")).toBe(5);
  });

  it("devuelve 0 cuando la suma es múltiplo de 10", () => {
    // 0+9+2+1+2+1+2+1+2 = 20 -> dígito 0
    expect(calcularDigitoCedula("091111111")).toBe(0);
  });
});
