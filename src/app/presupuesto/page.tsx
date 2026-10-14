import {
  BusFront,
  CircleAlert,
  CircleEllipsis,
  Landmark,
  Ticket,
  Utensils,
  WalletCards,
} from "lucide-react";

import {
  accommodationBudgetReference,
  pendingBudgetCategories,
} from "@/data/eurotrip-2027/budget";
import { formatMoney } from "@/domain/trip/money";
import type { ExpenseCategory } from "@/domain/trip/types";

const categoryIcons: Record<
  Exclude<ExpenseCategory, "accommodation">,
  typeof BusFront
> = {
  transport: BusFront,
  food: Utensils,
  tickets: Ticket,
  other: CircleEllipsis,
};

const deadlineFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatLocalDate(localDate: string) {
  return deadlineFormatter.format(new Date(`${localDate}T00:00:00Z`));
}

export default function BudgetPage() {
  const reference = accommodationBudgetReference;

  return (
    <div className="budget-page">
      <header className="page-heading">
        <span className="page-heading__icon" aria-hidden="true">
          <WalletCards size={22} />
        </span>
        <div>
          <p className="eyebrow">PRESUPUESTO</p>
          <h1 className="page-title">Una referencia, cuatro rubros pendientes</h1>
          <p className="page-description">
            Resumen inicial en COP y EUR, sin tasas de cambio automáticas ni
            pagos inventados.
          </p>
        </div>
      </header>

      <aside className="planning-notice" aria-label="Aviso de presupuesto">
        <CircleAlert aria-hidden="true" size={20} />
        <div>
          <strong>Referencia, no total cerrado</strong>
          <p>
            Solo hay una cifra comunicada para alojamiento. Debe contrastarse
            con los soportes antes de tratarla como gasto pagado.
          </p>
        </div>
      </aside>

      <section className="budget-reference" aria-labelledby="lodging-budget">
        <div className="budget-reference__topline">
          <span className="budget-reference__icon" aria-hidden="true">
            <Landmark size={22} />
          </span>
          <span className="status-badge" data-status={reference.status}>
            Por verificar
          </span>
        </div>

        <p>Seis alojamientos · 15 noches</p>
        <h2 id="lodging-budget">
          {formatMoney(reference.reportedTotal)}
        </h2>
        <span className="budget-reference__caption">Total comunicado</span>

        <dl className="budget-reference__facts">
          <div>
            <dt>Por persona</dt>
            <dd>{formatMoney(reference.reportedPerTraveler)}</dd>
          </div>
          <div>
            <dt>Viajeros</dt>
            <dd>{reference.travelerCount}</dd>
          </div>
          <div>
            <dt>Fecha general</dt>
            <dd>
              {reference.paymentDueDate
                ? formatLocalDate(reference.paymentDueDate)
                : "Pendiente"}
            </dd>
          </div>
        </dl>

        <p className="budget-reference__note">{reference.notes}</p>
      </section>

      <section className="currency-summary" aria-labelledby="currency-heading">
        <div className="transport-section__heading">
          <WalletCards aria-hidden="true" size={20} />
          <div>
            <h2 id="currency-heading">Monedas separadas</h2>
            <p>No se suman COP y EUR sin una tasa y fecha de referencia.</p>
          </div>
        </div>

        <div className="currency-summary__grid">
          <article>
            <span>COP</span>
            <strong>{formatMoney(reference.reportedTotal)}</strong>
            <p>Única referencia disponible: alojamientos.</p>
          </article>
          <article>
            <span>EUR</span>
            <strong>Sin montos todavía</strong>
            <p>Transporte interno, comidas y entradas siguen pendientes.</p>
          </article>
        </div>
      </section>

      <section className="pending-budget" aria-labelledby="pending-heading">
        <div className="transport-section__heading">
          <CircleEllipsis aria-hidden="true" size={20} />
          <div>
            <h2 id="pending-heading">Falta presupuestar</h2>
            <p>Estos rubros no participan aún en ningún total.</p>
          </div>
        </div>

        <div className="pending-budget__list">
          {pendingBudgetCategories.map((item) => {
            const Icon = categoryIcons[item.category];

            return (
              <article key={item.category}>
                <span aria-hidden="true">
                  <Icon size={19} />
                </span>
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.notes}</p>
                </div>
                <strong>Pendiente</strong>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
