import type {
  BudgetReference,
  ExpenseCategory,
} from "@/domain/trip/types";

export const accommodationBudgetReference = {
  id: "reported-accommodation-total",
  category: "accommodation",
  reportedTotal: {
    amount: 10_061_140,
    currency: "COP",
  },
  reportedPerTraveler: {
    amount: 2_515_285,
    currency: "COP",
  },
  travelerCount: 4,
  paymentDueDate: "2027-04-25",
  status: "to_verify",
  notes:
    "Valor comunicado para las seis reservas. Confirmar soportes, impuestos y fecha de pago de cada reserva.",
} as const satisfies BudgetReference;

type PendingBudgetCategory = Readonly<{
  category: Exclude<ExpenseCategory, "accommodation">;
  label: string;
  notes: string;
}>;

export const pendingBudgetCategories = [
  {
    category: "transport",
    label: "Transporte",
    notes: "Faltan precios reales de todos los trayectos internos.",
  },
  {
    category: "food",
    label: "Comidas",
    notes: "Pendiente acordar un presupuesto diario para cuatro viajeros.",
  },
  {
    category: "tickets",
    label: "Entradas",
    notes: "Pendiente definir visitas y comprobar precios oficiales de 2027.",
  },
  {
    category: "other",
    label: "Otros",
    notes: "Sin monto para seguros, conectividad, imprevistos u otros gastos.",
  },
] as const satisfies readonly PendingBudgetCategory[];
