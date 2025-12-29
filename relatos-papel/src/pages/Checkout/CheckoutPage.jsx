import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Head from "../../components/utils/HeadLanding";
import { APP_ORIGIN } from "../../constants/env";

import CheckoutHeader from "../../components/checkout/CheckoutHeader";
import PayBanner from "../../components/checkout/PayBanner";
import PayMethods from "../../components/checkout/PayMethods";
import CardForm from "../../components/checkout/CardForm";
import OrderSummary from "../../components/checkout/OrderSummary";
import ConfirmPanel from "../../components/checkout/ConfirmPanel";
import useCountdownRedirect from "../../hooks/useCountdownRedirect";

import { getCart, getTotals, saveCart, saveTotals } from "../../utils/cartUtils";

import "../../assets/css/styles-checkout.css";

export default function CheckoutPage() {
  const { lang } = useParams();
  const { t, i18n } = useTranslation("checkout");

  const canonical = `${APP_ORIGIN}/${lang}/checkout`;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [method, setMethod] = useState("card");
  const [paid, setPaid] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const countdown = useCountdownRedirect(`/${lang}/catalog`, 5, paid);

  // Totales siempre inicializados con valores seguros
  const [totals, setTotals] = useState(
      getTotals() || { subtotal: 0, discount: 0, shipping: 0, taxes: 0, total: 0 }
  );

  useEffect(() => {
    if (lang && i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    setItems(getCart());
    setLoading(false);
    const onTotalsUpdated = () => setTotals(getTotals());
    window.addEventListener("cartTotalsUpdated", onTotalsUpdated);
    return () => window.removeEventListener("cartTotalsUpdated", onTotalsUpdated);
  },
      []);

  const payDisabled =
      loading ||
      items.length === 0 ||
      (method === "card" &&
          (!cardName.trim() ||
              cardNumber.replace(/\s/g, "").length < 12 ||
              !cardExp.trim() ||
              cardCvc.trim().length < 3));

  const onPay = (e) => {
    e.preventDefault();
    if (payDisabled)
      return;
    setPaid(true);
    saveCart([]);
    saveTotals({
      subtotal: 0, discount: 0, shipping: 0, taxes: 0, total: 0
    });
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("cartTotalsUpdated"));
  };

  return (
      <div className="checkoutPage pay--full">
        <Head
            lang={lang}
            title={t("seo.title")}
            description={t("seo.description")}
            keywords={t("seo.keywords")}
            canonical={canonical}
            ogImage="/assets/img/og-checkout.jpg"
            siteName="Librería dígital"
            locale={lang === "es" ? "es_EC" : "en_US"}
        />

        <CheckoutHeader lang={lang} />

        <main className="pay__content">
          <div className="container-fluid px-0 px-lg-3">
            {loading ? (
                <div className="panel panel--elevated">
                  <div className="panel__body">
                    {lang === "en" ? "Loading…" : "Cargando…"}
                  </div>
                </div>
            ) : items.length === 0 ? (
                <div className="panel panel--elevated">
                  <div className="panel__body">
                    {lang === "en"
                        ? "Your cart is empty."
                        : "Tu carrito está vacío."}{" "}
                    <Link to={`/${lang}/catalog`}>
                      {lang === "en" ? "Go to catalog" : "Ir al catálogo"}
                    </Link>
                  </div>
                </div>
            ) : (
                <div className="row g-3 align-items-start">
                  <section className="col-12 col-lg-7" aria-label="Pago">
                    <PayBanner />

                    {!paid ? (
                        <form
                            onSubmit={onPay}
                            className="mt-3"
                            aria-label="Formulario de pago"
                        >
                          <PayMethods method={method} onChange={setMethod} />

                          {method === "card" && (
                              <div className="mt-3">
                                <CardForm
                                    cardName={cardName}
                                    setCardName={setCardName}
                                    cardNumber={cardNumber}
                                    setCardNumber={setCardNumber}
                                    cardExp={cardExp}
                                    setCardExp={setCardExp}
                                    cardCvc={cardCvc}
                                    setCardCvc={setCardCvc}
                                />
                              </div>
                          )}

                          <div className="d-flex gap-2 mt-3">
                            <Link className="btn pay__ghostBtn" to={`/${lang}/cart`}>
                              {t("actions.back")}
                            </Link>

                            <button
                                className="btn pay__primaryBtn ms-auto"
                                type="submit"
                                disabled={payDisabled}
                            >
                              {t("actions.pay")}
                            </button>
                          </div>
                        </form>
                    ) : (
                        <div className="mt-3">
                          <ConfirmPanel />
                          <div className="d-flex gap-2 mt-3">
                            <Link
                                className="btn confirm__btn confirm__btn--ghost"
                                to={`/${lang}/catalog`}
                            >
                              {t("actions.continue")}
                            </Link>
                          </div>
                        </div>
                    )}
                  </section>

                  <aside className="col-12 col-lg-5" aria-label="Resumen del pedido">
                    <OrderSummary lang={lang} items={items} totals={totals} />
                  </aside>
                </div>
            )}
          </div>
        </main>
      </div>
  );
}
