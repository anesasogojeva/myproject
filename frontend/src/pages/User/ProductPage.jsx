import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ProductCard from "../../components/UI/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Fetch the main product
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(data.image); // default main image
      })
      .catch((err) => console.error(err));

    // Fetch recommended products
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((p) => p.id !== parseInt(id));
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 4));
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div className="text-center py-20">Loading product...</div>;

  // Thumbnail images
  const images = product.images || [product.image];

  const handleAddToCart = () => {
    addToCart(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 relative">
      {/* Fancy Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border-2 border-black rounded-2xl shadow-lg px-4 py-3 animate-slide-in-out max-w-xs">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 object-contain rounded-lg"
          />
          <span className="text-black font-medium">{product.name} added to cart!</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* PRODUCT IMAGE WITH ZOOM */}
        <div>
          <Zoom>
            <img
              src={mainImage}
              alt={product.name}
              className="rounded-3xl shadow-xl object-contain w-full max-h-[500px]"
            />
          </Zoom>

          {/* THUMBNAILS */}
          <div className="flex gap-4 mt-4">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${
                  img === mainImage ? "border-pink-500" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="flex flex-col justify-start gap-6">
          <h1 className="text-4xl font-extrabold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-lg">{product.description}</p>
          <p className="text-3xl font-bold text-black">${product.price.toFixed(2)}</p>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-pink-500 text-white py-3 rounded-2xl shadow-lg hover:bg-pink-400 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* RECOMMENDED PRODUCTS */}
      {recommended.length > 0 && (
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Recommended for You
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
            {recommended.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="flex-shrink-0 w-64 snap-start"
              >
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>
        {`
          @keyframes slide-in-out {
            0% { transform: translateX(100%) scale(0.8); opacity: 0; }
            10% { transform: translateX(0) scale(1); opacity: 1; }
            90% { transform: translateX(0) scale(1); opacity: 1; }
            100% { transform: translateX(100%) scale(0.8); opacity: 0; }
          }
          .animate-slide-in-out {
            animation: slide-in-out 3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
          }
        `}
      </style>
    </div>
  );
}
