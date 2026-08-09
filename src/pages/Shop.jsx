import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { fetchProducts } from "../api/products.js";
import FilterBar from "../components/shop/FilterBar.jsx";
import ProductCard from "../components/shop/ProductCard.jsx";
import Pagination from "../components/shop/Pagination.jsx";
import BackToTop from "../components/nav/BackToTop.jsx";
import CartIcon from "../components/cart/CartIcon.jsx";

const PAGE_SIZE = 6;

export default function Shop() {
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    fetchProducts({
      page,
      pageSize: PAGE_SIZE,
      category,
    })
      .then((res) => {
        if (cancelled) return;

        setItems(res.items);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Could not load products — please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, category]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div
      className="
        min-h-screen
        bg-[var(--beige)]
        px-6
        py-8
        sm:px-8
        sm:py-10
        md:px-12
        lg:px-16
        xl:px-20
      "
    >
      <CartIcon />
      <BackToTop />
      {/* Back */}
      <Link
        to="/"
        className="
          display
          mb-8
          inline-block
          text-[30px]
          text-[var(--dark-green)]
          transition-opacity
          duration-300
          hover:opacity-70
        "
      >
        ← Raheeq
      </Link>

      {/* Header */}
      <header className="mb-10 text-center">
        <div
          className="
            mb-3
            text-3xl
            tracking-[0.2em]
            text-yellow-500
          "
        >
          THE COLLECTION
        </div>

        <h1
          className="
            display
            m-0
            text-[clamp(1.8rem,4vw,3rem)]
            text-[var--dark-green)]
          "
        >
          Shop Raheeq
        </h1>
      </header>

      {/* Filters */}
      <FilterBar
        active={category}
        onChange={handleCategoryChange}
      />

      {/* Products */}
      {loading ? (
        <div
          className="
            flex
            min-h-[300px]
            items-center
            justify-center
            text-center
            text-[rgba(242,234,217,0.6)]
          "
        >
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div
          className="
            flex
            min-h-[300px]
            items-center
            justify-center
            px-4
            text-center
            text-[rgba(242,234,217,0.6)]
          "
        >
          No products in this category yet.
        </div>
      ) : (
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-[1200px]
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  );
}
