import { useTranslation } from "react-i18next";

export default function CardForm({
                                   cardName,
                                   setCardName,
                                   cardNumber,
                                   setCardNumber,
                                   cardExp,
                                   setCardExp,
                                   cardCvc,
                                   setCardCvc
                                 }) {
  const { t } = useTranslation("checkout");

  // Vista previa del número
  const maskedNumber = (cardNumber || "")
      .replace(/[^\d]/g, "")
      .padEnd(16, "•")
      .slice(0, 16);
  const prettyNumber = maskedNumber.replace(/(.{4})/g, "$1 ").trim();

  // Validaciones
  const handleCardNameChange = (e) => {
    const value = e.target.value;
    const sanitized = value.replace(/[0-9]/g, ""); // elimina números
    setCardName(sanitized);
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // solo dígitos
    setCardNumber(value.slice(0, 16)); // máximo 16 dígitos
  };

  const handleCardExpChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // solo dígitos
    if (value.length > 4) value = value.slice(0, 4);

    // Formatear como MM/AA
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setCardExp(value);
  };

  const handleCardCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // solo dígitos
    setCardCvc(value.slice(0, 3)); // máximo 3 dígitos
  };

  return (
      <div className="panel panel--elevated cardForm" aria-label={t("cardForm.title")}>
        <div className="panel__head cardForm__head">
          <div className="cardForm__icon" aria-hidden="true">
            <i className="fa-solid fa-id-card"></i>
          </div>
          <div>
            <div className="fw-bold">{t("cardForm.title")}</div>
            <div className="cardForm__sub">{t("cardForm.sub")}</div>
          </div>
        </div>

        <div className="panel__body cardForm__body">
          <div className="cardMock" aria-label="Vista previa de tarjeta">
            <div className="cardMock__top">
              <i className="fa-solid fa-wifi cardMock__wifi" aria-hidden="true"></i>
              <i className="fa-solid fa-lock cardMock__lock" aria-hidden="true"></i>
            </div>

            <div className="cardMock__number">{prettyNumber}</div>

            <div className="cardMock__bottom">
              <div>
                <div className="cardMock__label">{t("cardForm.labels.name")}</div>
                <div className="cardMock__value">{(cardName || "—").toUpperCase()}</div>
              </div>
              <div>
                <div className="cardMock__label">{t("cardForm.labels.exp")}</div>
                <div className="cardMock__value">{cardExp || "—"}</div>
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div className="mb-3">
            <label className="cardForm__label form-label" htmlFor="cardName">
              {t("cardForm.labels.name")}
            </label>
            <div className="input-group cardForm__group">
            <span className="input-group-text cardForm__addon" aria-hidden="true">
              <i className="fa-regular fa-user"></i>
            </span>
              <input
                  id="cardName"
                  className="form-control cardForm__control"
                  value={cardName}
                  onChange={handleCardNameChange}
                  placeholder={t("cardForm.placeholders.name")}
                  autoComplete="cc-name"
              />
            </div>
          </div>

          {/* Número */}
          <div className="mb-3">
            <label className="cardForm__label form-label" htmlFor="cardNumber">
              {t("cardForm.labels.number")}
            </label>
            <div className="input-group cardForm__group">
            <span className="input-group-text cardForm__addon" aria-hidden="true">
              <i className="fa-solid fa-credit-card"></i>
            </span>
              <input
                  id="cardNumber"
                  className="form-control cardForm__control"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder={t("cardForm.placeholders.number")}
                  inputMode="numeric"
                  autoComplete="cc-number"
              />
            </div>
          </div>

          {/* Exp y CVC */}
          <div className="row g-2">
            <div className="col-6">
              <label className="cardForm__label form-label" htmlFor="cardExp">
                {t("cardForm.labels.exp")}
              </label>
              <input
                  id="cardExp"
                  className="form-control cardForm__control"
                  value={cardExp}
                  onChange={handleCardExpChange}
                  placeholder="MM/AA"
                  autoComplete="cc-exp"
              />
            </div>

            <div className="col-6">
              <label className="cardForm__label form-label" htmlFor="cardCvc">
                {t("cardForm.labels.cvc")}
              </label>
              <input
                  id="cardCvc"
                  className="form-control cardForm__control"
                  value={cardCvc}
                  onChange={handleCardCvcChange}
                  placeholder="CVC"
                  inputMode="numeric"
                  autoComplete="cc-csc"
              />
            </div>
          </div>

          <div className="cardForm__footNote" role="note">
            <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
            <span>{t("cardForm.note")}</span>
          </div>
        </div>
      </div>
  );
}
