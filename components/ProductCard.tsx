"use client";

import { ShoppingCart, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow w-44 flex-shrink-0">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <span className="absolute top-2 left-2 bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {product.category}
        </span>
      </div>
      <div className="p-3">
        <p className="text-slate-800 text-xs font-semibold leading-tight line-clamp-2 mb-1">{product.name}</p>
        <div className="flex items-center gap-1 mb-2">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] text-slate-500">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-bold text-sm">${product.price.toFixed(2)}</span>
          {product.inStock && (
            <button className="bg-blue-600 text-white rounded-lg p-1.5 hover:bg-blue-700 transition-colors" aria-label="Add to cart">
              <ShoppingCart size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
