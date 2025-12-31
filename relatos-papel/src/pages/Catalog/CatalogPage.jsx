import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Head from "../../components/utils/HeadLanding";
import CatalogHeader from "../../components/catalog/CatalogHeader";
import CatalogSearchBar from "../../components/catalog/CatalogSearchBar";
import CatalogPanel from "../../components/catalog/CatalogPanel";
import RecommendationsPanel from "../../components/catalog/RecommendationsPanel";
import FiltersPanel from "../../components/catalog/FiltersPanel";
import { APP_ORIGIN } from "../../constants/env";

import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import "../../assets/css/styles-catalog-books.css";

export default function CatalogPage() {
  const { lang } = useParams();
  const { t } = useTranslation("catalog");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dtApi, setDtApi] = useState(null);

  const [q, setQ] = useState("");

  const canonical = `${APP_ORIGIN}/${lang}/catalog`;

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const res = await fetch("/data/books-v2.json");
        const data = await res.json();

        if (alive) {
          // 🔹 Filtrar duplicados por id
          const uniqueBooks = Array.isArray(data)
              ? data.filter(
                  (book, index, self) =>
                      index === self.findIndex((b) => b.id === book.id)
              )
              : [];
          setBooks(uniqueBooks);
        }
      } catch (e) {
        console.error("Error cargando books-v2.json:", e);
        if (alive) setBooks([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);


  useEffect(() => {
    if (!dtApi) return;
    dtApi.search(q).draw();
  }, [q, dtApi]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (!dtApi) return;
    dtApi.search(q).draw();
  };

  return (
    <>
      <Head
        lang={lang}
        title={t("seo.title")}
        description={t("seo.description")}
        keywords={t("seo.keywords")}
        canonical={canonical}
        ogImage="/assets/img/og-catalog.jpg"
        siteName="Librería dígital"
        locale={lang === "es" ? "es_EC" : "en_US"}
      />

      <div className="catalogPage catalog catalog--full bg-white">
        <CatalogHeader />

        <div className="catalog__searchBar">
          <div className="container-fluid px-0 px-lg-3">
            <CatalogSearchBar
              value={q}
              onChange={setQ}
              onSubmit={onSearchSubmit}
            />

            <div className="catalog__main">
              <div className="container-fluid px-0 px-lg-3">
                <div className="row g-3 align-items-start">
                  <section
                    className="col-12 col-lg-9"
                    aria-label="Listado de libros"
                  >
                    {loading ? (
                      <p className="text-center text-muted mb-0">
                        {lang === "en" ? "Loading..." : "Cargando..."}
                      </p>
                    ) : (
                      <CatalogPanel
                        lang={lang}
                        rows={books}
                        onReady={setDtApi}
                      />
                    )}
                  </section>

                  <aside
                    className="col-12 col-lg-3"
                    aria-label="Panel lateral"
                  >
                    <div className="d-grid gap-3">
                      <RecommendationsPanel lang={lang} />
                      <FiltersPanel dtApi={dtApi} />
                    </div>
                  </aside>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}