import { describe, expect, it } from "vitest";
import { analizarCedula, analizarRuc, generarCedula, generarRuc, type TipoRuc } from "../src";

/** Generador congruencial lineal con semilla, para pruebas reproducibles. */
function semilla(valor: number): () => number {
  let estado = valor;
  return () => {
    estado = (estado * 1664525 + 1013904223) % 2 ** 32;
    return estado / 2 ** 32;
  };
}

describe("generarCedula", () => {
  it("genera cédulas válidas", () => {
    for (let i = 0; i < 1000; i++) {
      const cedula = generarCedula();
      expect(analizarCedula(cedula), cedula).toMatchObject({ valido: true });
    }
  });

  it("respeta la provincia indicada", () => {
    expect(generarCedula({ provincia: "09" })).toMatch(/^09/);
  });

  it("es reproducible con la misma fuente aleatoria", () => {
    expect(generarCedula({ aleatorio: semilla(42) })).toBe(generarCedula({ aleatorio: semilla(42) }));
  });

  it("rechaza provincias inexistentes", () => {
    expect(() => generarCedula({ provincia: "99" })).toThrow(RangeError);
  });
});

describe("generarRuc", () => {
  it.each<TipoRuc>(["natural", "privada", "publica"])("genera RUC válidos de tipo %s", (tipo) => {
    for (let i = 0; i < 1000; i++) {
      const ruc = generarRuc({ tipo });
      expect(analizarRuc(ruc), ruc).toMatchObject({ valido: true, tipo });
    }
  });

  it("genera persona natural por defecto", () => {
    expect(analizarRuc(generarRuc())).toMatchObject({ tipo: "natural" });
  });
});
