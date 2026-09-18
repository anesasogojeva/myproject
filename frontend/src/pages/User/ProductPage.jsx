import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { ShoppingCart, ChevronLeft, PackageX } from "lucide-react";
import ProductCard from "../../components/UI/ProductCard";
import Button from "../../components/UI/Button";
import { PageSpinner } from "../../components/UI/Spinner";
import ImageWithFallback from "../../components/UI/ImageWithFallback";
import EmptyState from "../../components/UI/EmptyState";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setMainImage(data.image);
      })
      .catch(() => setNotFound(true));

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((p) => p.id !== parseInt(id));
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 4));
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (notFound) {
    return (
      <div className="container-app py-14">
        <EmptyState
          icon={PackageX}
          title="Product not found"
          description="This product may have been removed or is no longer available."
          action={<Button to="/products">Back to Shop</Button>}
        />
      </div>
    );
  }

  if (!product) return <PageSpinner label="Loading product..." />;

  const images = product.images || [product.image];

  return (
    <div className="container-app py-10 sm:py-14">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-emerald-700 transition mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <div className="rounded-3xl overflow-hidden bg-cream-100 border border-stone-200/70">
            <Zoom>
              <ImageWithFallback
                src={mainImage}
                alt={product.name}
                className="w-full aspect-square object-cover"
                iconClassName="w-14 h-14"
              />
            </Zoom>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    img === mainImage ? "border-emerald-600" : "border-stone-200 hover:border-emerald-300"
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    iconClassName="w-5 h-5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 w-fit px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">{product.name}</h1>
          <p className="text-stone-500 text-base leading-relaxed">{product.description}</p>
          <p className="text-3xl font-display font-bold text-emerald-700">
            ${Number(product.price).toFixed(2)}
          </p>

          <Button size="lg" icon={ShoppingCart} onClick={() => addToCart(product)}>
            Add to Cart
          </Button>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mb-8">
            You may also like
          </h2>

          <div className="flex gap-5 overflow-x-auto pb-4 scroll-thin scroll-smooth snap-x snap-mandatory">
            {recommended.map((p) => (
              <div key={p.id} className="flex-shrink-0 w-56 sm:w-64 snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
