const ptBR = 'pt-BR';

export function formatCurrency(value: number | string | null | undefined): string {
  const num = Number(value);
  if (isNaN(num)) return '-';
  return new Intl.NumberFormat(ptBR, {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

export function formatNumber(value: number | string | null | undefined, decimals = 2): string {
  const num = Number(value);
  if (isNaN(num)) return '-';
  return new Intl.NumberFormat(ptBR, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatQuantity(value: number | string | null | undefined, unit?: string): string {
  const num = Number(value);
  if (isNaN(num)) return '-';
  const formatted = new Intl.NumberFormat(ptBR, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
  return unit ? `${formatted} ${unit}` : formatted;
}
