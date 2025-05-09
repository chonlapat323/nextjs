"use client";

import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import { addToCart } from "@/services/member/cart.service";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { flyToCart } from "@/lib/cart-animation";
import { ProductCardProps } from "@/types/ui/product-card";
import { formatCurrencyTHB } from "@/utils/format-currency";

export default function ProductCard({ product }: ProductCardProps) {
  const [hoveredPopup, setHoveredPopup] = useState<number | null>(null);
  const [cartPopup, setCartPopup] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { increase, refresh } = useCart();
  const imageRef = useRef<HTMLImageElement>(null);
  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      const cartIcon = document.getElementById("cart-icon");
      if (imageRef.current && cartIcon) {
        flyToCart(imageRef.current, cartIcon);
      }

      await addToCart(product.id);
      increase(1);
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถเพิ่มสินค้าได้");
    } finally {
      setIsAdding(false);
    }
  };
  const image = product.product_image?.[0]?.url
    ? `${API_URL}${product.product_image[0].url}`
    : "/uploads/no-image.jpg";
  return (
    <div
      key={product.id}
      className="group relative bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center"
    >
      <div className="relative w-full sm:aspect-[3/5]  md:aspect-[4.8/5] aspect-[5/5] overflow-hidden">
        <Image
          ref={imageRef}
          src={image}
          alt={product.name}
          fill
          className="md:object-contain  object-contain transition-transform group-hover:scale-105"
        />
      </div>

      <div className="text-center mt-4">
        <p className="font-semibold">{product.name}</p>
        <p className="text-gray-500">
          {formatCurrencyTHB(Number(product.price))}
        </p>
        {Array.isArray(product.tags) && product.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 group-hover:pointer">
        <div
          className="relative"
          onMouseEnter={() => setCartPopup(product.id)}
          onMouseLeave={() => setCartPopup(null)}
        >
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="cursor-pointer p-2 bg-black text-white rounded-full shadow-md hover:bg-gray-800 cursor-pointer"
          >
            <ShoppingCartOutlined />
          </button>

          {cartPopup === product.id && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2 py-[2px] rounded shadow-md text-center whitespace-nowrap">
              Add to Cart
              <div
                className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0
                border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"
              ></div>
            </div>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setHoveredPopup(product.id)}
          onMouseLeave={() => setHoveredPopup(null)}
        >
          <Link
            href={`/catalog/product/${product.id}`}
            key={`view-product-${product.id}`}
          >
            <button className="p-2 bg-black text-white rounded-full shadow-md hover:bg-gray-800 cursor-pointer">
              <EyeOutlined />
            </button>
          </Link>

          {hoveredPopup === product.id && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2 py-[2px] rounded shadow-md text-center whitespace-nowrap">
              Quick View
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
