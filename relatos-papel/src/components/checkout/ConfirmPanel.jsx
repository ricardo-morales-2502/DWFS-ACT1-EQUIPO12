import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCountdownRedirect } from "../../hooks/useCountdownRedirect";
import {useParams} from "react-router-dom";

export default function ConfirmPanel({ method }) {
  const { t } = useTranslation("checkout");
  const { lang } = useParams();

  const orderId = useMemo(() => {
    const rnd = Math.random().toString(16).slice(2, 10).toUpperCase();
    return `RP-${rnd}`;
  }, []);

  const methodText =
    method === "paypal" ? "PayPal" : method === "bank" ? (t("method.bank.name")) : (t("method.card.name"));

  const { remaining, cancelled } = useCountdownRedirect({
    seconds: 5,
    to: `/${lang}/catalog`,
    enabled: true
  });

  const now = new Date();
  const dateText = now.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

  return (
    <div className="panel panel--elevated" aria-label={t("confirm.title")}>
      <div className="confirm__body">
        <div className="confirm__icon" aria-hidden="true">
          <i className="fa-solid fa-check"></i>
        </div>
        <h2 className="confirm__title">{t("confirm.title")}</h2>
        <p className="confirm__text">{t("confirm.text")}</p>
        <p className="confirm__text confirm__text--muted">{t("confirm.muted")}</p>

        <div className="confirm__order">
          <div className="confirm__orderLabel">{t("confirm.orderLabel")}</div>
          <div className="confirm__orderValue">{orderId}</div>

          <div className="confirm__meta">
            <Row label={t("confirm.statusLabel")} value={t("confirm.statusOk")} ok />
            <Row label={t("confirm.methodLabel")} value={methodText} />
            <Row label={t("confirm.dateLabel")} value={dateText} />
          </div>
        </div>

        <div className="confirm__secureNote" role="note">
          <i className="fa-solid fa-lock" aria-hidden="true"></i> {t("confirm.secureNote")}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, ok = false }) {
  return (
    <div className="confirm__metaRow">
      <div className="confirm__metaLabel">{label}</div>
      <div className={`confirm__metaValue ${ok ? "confirm__metaValue--ok" : ""}`}>{value}</div>
    </div>
  );
}