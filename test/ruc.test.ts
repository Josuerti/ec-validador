import { describe, expect, it } from "vitest";
import { analizarRuc, validarIdentificacion, validarRuc } from "../src";

describe("validarRuc", () => {
  it("identifica RUC de persona natural", () => {
    expect(analizarRuc("1710034065001")).toEqual({
      valido: true,
      ruc: "1710034065001",
      tipo: "natural",
      provincia: "Pichincha",
      establecimiento: "001",
    });
  });

  it("identifica RUC de sociedad privada", () => {
    expect(analizarRuc("1790011674001")).toMatchObject({ valido: true, tipo: "privada" });
  });

  it("identifica RUC de entidad pública", () => {
    expect(analizarRuc("1760001550001")).toMatchObject({
      valido: true,
      tipo: "publica",
      establecimiento: "0001",
    });
  });

  it.each([
    ["171003406500", "FORMATO_INVALIDO"],
    ["2590011674001", "PROVINCIA_INVALIDA"],
    ["1770011674001", "TERCER_DIGITO_INVALIDO"],
    ["1710034064001", "DIGITO_VERIFICADOR_INVALIDO"],
    ["1790011675001", "DIGITO_VERIFICADOR_INVALIDO"],
    ["1760001560001", "DIGITO_VERIFICADOR_INVALIDO"],
    ["1710034065000", "ESTABLECIMIENTO_INVALIDO"],
    ["1790011674000", "ESTABLECIMIENTO_INVALIDO"],
    ["1760001550000", "ESTABLECIMIENTO_INVALIDO"],
  ])("rechaza %s con %s", (ruc, error) => {
    expect(analizarRuc(ruc)).toEqual({ valido: false, error });
  });

  it("permite omitir el módulo 11 en sociedades", () => {
    expect(validarRuc("1790011675001")).toBe(false);
    expect(validarRuc("1790011675001", { verificarDigitoSociedades: false })).toBe(true);
  });

  it("sigue validando la cédula en persona natural aunque se omita el módulo 11", () => {
    expect(validarRuc("1710034064001", { verificarDigitoSociedades: false })).toBe(false);
  });
});

describe("validarIdentificacion", () => {
  it("acepta cédula o RUC", () => {
    expect(validarIdentificacion("1710034065")).toBe(true);
    expect(validarIdentificacion("1790011674001")).toBe(true);
    expect(validarIdentificacion("123")).toBe(false);
  });
});
