# ec-validador

[![CI](https://github.com/Josuerti/ec-validador/actions/workflows/ci.yml/badge.svg)](https://github.com/Josuerti/ec-validador/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/ec-validador.svg)](https://www.npmjs.com/package/ec-validador)
![bundle](https://img.shields.io/bundlephobia/minzip/ec-validador)
![license](https://img.shields.io/npm/l/ec-validador)

Valida **cédulas** y **RUC** de Ecuador, sin dependencias, con tipos de TypeScript incluidos.

- ✅ Cédula (módulo 10)
- ✅ RUC de persona natural, sociedad privada (módulo 11) y entidad pública
- ✅ Te dice **por qué** falla una identificación, no solo `true`/`false`
- ✅ Detecta la provincia y el número de establecimiento
- ✅ Genera cédulas y RUC ficticios válidos para pruebas
- ✅ Funciona con ESM, CommonJS, Node y navegador

## Instalación

```bash
npm install ec-validador
```

## Uso

```ts
import { validarCedula, validarRuc, analizarRuc } from "ec-validador";

validarCedula("1710034065"); // true
validarCedula("171003406-5"); // true (ignora guiones y espacios)
validarRuc("1790011674001"); // true

analizarRuc("1790011674001");
// {
//   valido: true,
//   ruc: "1790011674001",
//   tipo: "privada",
//   provincia: "Pichincha",
//   establecimiento: "001"
// }

analizarRuc("1790011675001");
// { valido: false, error: "DIGITO_VERIFICADOR_INVALIDO" }
```

## API

| Función | Devuelve |
| --- | --- |
| `validarCedula(valor)` | `boolean` |
| `analizarCedula(valor)` | `{ valido, cedula, provincia }` o `{ valido: false, error }` |
| `calcularDigitoCedula(nueveDigitos)` | dígito verificador (`number`) |
| `validarRuc(valor, opciones?)` | `boolean` |
| `analizarRuc(valor, opciones?)` | `{ valido, ruc, tipo, provincia, establecimiento }` o `{ valido: false, error }` |
| `validarIdentificacion(valor, opciones?)` | `true` si es una cédula **o** un RUC válido |
| `obtenerProvincia(codigo)` | nombre de la provincia, o `undefined` |
| `generarCedula(opciones?)` | cédula ficticia válida (`string`) |
| `generarRuc(opciones?)` | RUC ficticio válido (`string`) |

### Códigos de error

`FORMATO_INVALIDO` · `PROVINCIA_INVALIDA` · `TERCER_DIGITO_INVALIDO` · `DIGITO_VERIFICADOR_INVALIDO` · `ESTABLECIMIENTO_INVALIDO`

### Opciones de RUC

```ts
validarRuc(ruc, { verificarDigitoSociedades: false });
```

El SRI ha emitido RUC de sociedades que **no cumplen** el algoritmo de módulo 11. Si tu sistema no puede rechazar RUC reales (por ejemplo, en facturación), desactiva esta verificación. La cédula de una persona natural se sigue validando siempre.

### Datos de prueba

Para tests, seeds o formularios de demo no hacen falta cédulas reales: genera números ficticios que pasan la validación.

```ts
import { generarCedula, generarRuc } from "ec-validador";

generarCedula();                      // "0931524870"
generarCedula({ provincia: "17" });   // empieza con 17 (Pichincha)
generarRuc({ tipo: "privada" });      // "1798452637001"
generarRuc({ tipo: "publica" });      // "0960213480001"

// Resultados reproducibles: pasa tu propia fuente de números en [0, 1)
generarCedula({ aleatorio: miGeneradorConSemilla });
```

Los números son matemáticamente válidos, pero no se verifican contra el Registro Civil ni el SRI: pueden coincidir por azar con una persona real, así que úsalos solo como datos de prueba.

## Cómo funciona

| Tipo | Tercer dígito | Algoritmo | Dígito verificador | Establecimiento |
| --- | --- | --- | --- | --- |
| Cédula / persona natural | 0–5 | Módulo 10, coeficientes `2 1 2 1 2 1 2 1 2` | posición 10 | últimos 3 |
| Sociedad privada | 9 | Módulo 11, coeficientes `4 3 2 7 6 5 4 3 2` | posición 10 | últimos 3 |
| Entidad pública | 6 | Módulo 11, coeficientes `3 2 7 6 5 4 3 2` | posición 9 | últimos 4 |

Los dos primeros dígitos son el código de provincia (`01`–`24`, o `30` para ecuatorianos en el exterior).

## Desarrollo

```bash
npm install
npm test          # pruebas con Vitest
npm run typecheck # chequeo de tipos
npm run build     # genera dist/ (ESM + CJS + .d.ts)
```

## Licencia

MIT
