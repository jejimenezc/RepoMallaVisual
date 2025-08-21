// src/utils/calc.ts
export function evaluateExpression(
  expr: string,
  values: Record<string, number>
): number {
  if (!expr) return NaN;
  const replaced = expr.replace(/r\d+c\d+/g, (token) => {
    const val = values[token];
    return val !== undefined ? String(val) : '0';
  });
  try {
    if (/[^0-9+\-*/().\s]/.test(replaced)) return NaN;
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${replaced});`)();
    return typeof result === 'number' && !isNaN(result) ? result : NaN;
  } catch {
    return NaN;
  }
}