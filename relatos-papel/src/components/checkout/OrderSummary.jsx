import { useTranslation } from "react-i18next";

export default function OrderSummary({ lang, items, totals }) {
  const { t } = useTranslation("checkout");

  return (
      <div className="panel panel--elevated" aria-label={t("summary.title")}>
        <div className="panel__head">
          <div className="summary__icon" aria-hidden="true">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <div>
            <div className="fw-bold">{t("summary.title")}</div>
            <div className="summary__sub">{t("summary.sub")}</div>
          </div>
        </div>

        <div className="panel__body">
          <div className="summary__lines">
            {/* Subtotal siempre */}
            <Line label={t("summary.subtotal")} value={formatCurrency(totals.subtotal, lang)} />

            {/* Descuento solo si es mayor que 0 */}
            {Number(totals.discount) > 0 && (
                <Line
                    label={t("summary.discount")}
                    value={`- ${formatCurrency(totals.discount, lang)}`}
                />
            )}

            <Line label={t("summary.shipping")} value={formatCurrency(totals.shipping, lang)} />
            <Line label={t("summary.taxes")} value={formatCurrency(totals.taxes, lang)} />

            <div className="summary__divider" aria-hidden="true"></div>

            <div className="summary__line summary__line--total">
              <div className="summary__label">{t("summary.total")}</div>
              <div className="summary__value">{formatCurrency(totals.total, lang)}</div>
            </div>
          </div>

          <div className="summary__perks" aria-label="Beneficios">
            {t("summary.perks", { returnObjects: true }).map((p, idx) => (
                <div key={idx} className="summary__perk">
                  <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                  <span>{p}</span>
                </div>
            ))}
          </div>

          <div className="mt-3">
            <div className="fw-bold mb-2">{lang === "en" ? "Items" : "Productos"}</div>
            <div className="d-grid gap-2">
              {items.map((it) => (
                  <div key={it.id} className="d-flex justify-content-between gap-2">
                    <div className="text-truncate">
                      <span className="fw-bold">{it.title}</span>{" "}
                      <span className="text-muted">× {it.qty}</span>
                    </div>
                    <div className="fw-bold">
                      {formatCurrency(Number(it.price) * Number(it.qty), lang)}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

function Line({ label, value }) {
  return (
      <div className="summary__line">
        <div className="summary__label">{label}</div>
        <div className="summary__value">{value}</div>
      </div>
  );
}

function formatCurrency(value, lang) {
  return new Intl.NumberFormat(lang === "en" ? "en-US" : "es-EC", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);
}
