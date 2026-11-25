// Created once and reused: Intl knows the Brazilian format (R$ 49,90)
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(priceInCents: number): string {
  return brl.format(priceInCents / 100);
}
