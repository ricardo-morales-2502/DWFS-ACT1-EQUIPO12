import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


export default function CheckoutPanel({
  lang,
  coupon,
  setCoupon,
  appliedCoupon,
  onApplyCoupon,
  onClearCoupon,
  subtotal,
  discount,
  total,
  couponError
}) {
  const { t } = useTranslation("cart");
  const navigate = useNavigate();

  return (
    <div className="panel panel--elevated checkout" aria-label={t("checkout.title")}>
      <div className="panel__head checkout__head">
        <span className="checkout__icon" aria-hidden="true">
          <i className="fa-solid fa-credit-card"></i>
        </span>
        <div>
          <div className="fw-bold">{t("checkout.title")}</div>
          <div className="checkout__sub">{t("checkout.subtitle")}</div>
        </div>
      </div>

      <div className="panel__body checkout__body">
        <form className="checkout__couponGroup input-group" onSubmit={onApplyCoupon}>
          <span className="input-group-text checkout__addon">
            <i className="fa-solid fa-ticket" aria-hidden="true"></i>
          </span>

          <input
            className="form-control checkout__couponInput"
            placeholder={t("checkout.couponPlaceholder")}
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            aria-label={t("checkout.couponPlaceholder")}
          />

          <button className="btn checkout__applyBtn" type="submit">
            {t("checkout.apply")}
          </button>
        </form>

        {couponError && (
            <div className="text-danger mt-2" role="alert">
              {couponError}
            </div>
        )}

        {appliedCoupon && (
          <div className="checkout__applied" role="status" aria-live="polite">
            <div className="checkout__appliedLeft">
              <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
              <span>
                {t("checkout.applied")}: <strong>{appliedCoupon.code}</strong>
              </span>
            </div>
            <button className="checkout__appliedClose" type="button" onClick={onClearCoupon} aria-label={t("checkout.removeCoupon")}>
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>
        )}

        <div className="checkout__totals">
          <div className="checkout__row">
            <span className="checkout__label">{t("checkout.subtotal")}</span>
            <span className="checkout__value">{formatCurrency(subtotal, lang)}</span>
          </div>

          <div className="checkout__row checkout__row--discount">
            <span className="checkout__label">{t("checkout.discount")}</span>
            <span className="checkout__value">- {formatCurrency(discount, lang)}</span>
          </div>

          <div className="checkout__divider" />

          <div className="checkout__row checkout__row--total">
            <span className="checkout__label">{t("checkout.total")}</span>
            <span className="checkout__value">{formatCurrency(total, lang)}</span>
          </div>
        </div>

        <button className="btn checkout__payBtn w-100" type="button" onClick={() => navigate(`/${lang}/checkout`)}>
          <i className="fa-solid fa-lock" aria-hidden="true"></i> {t("checkout.pay")}
        </button>

        <div className="checkout__available" aria-label={t("checkout.availableTitle")}>
          <div className="checkout__availableTitle">{t("checkout.availableTitle")}</div>
          <ul className="checkout__availableList">
            <li>
              <button className="checkout__chip" type="button">
                <i className="fa-brands fa-cc-visa" aria-hidden="true"></i> Visa <span>• 3DS</span>
              </button>
            </li>
            <li>
              <button className="checkout__chip" type="button">
                <i className="fa-brands fa-cc-mastercard" aria-hidden="true"></i> MasterCard <span>• Secure</span>
              </button>
            </li>
            <li>
              <button className="checkout__chip" type="button">
                <i className="fa-brands fa-paypal" aria-hidden="true"></i> PayPal <span>• Instant</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value, lang) {
  return new Intl.NumberFormat(lang === "en" ? "en-US" : "es-EC", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}