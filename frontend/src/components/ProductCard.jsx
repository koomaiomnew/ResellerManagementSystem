import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatter';

const ProductCard = ({ product, isCatalog, onAction }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="group relative bg-white rounded-2xl shadow-md shadow-slate-200/50 overflow-hidden hover:shadow-xl hover:shadow-slate-300/40 transition-all duration-500 border border-slate-100 hover:border-slate-200 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img 
          src={product.image || 'https://via.placeholder.com/300'} 
          alt={product.name} 
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Stock Badge */}
        {!isCatalog && (
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
              product.stock === 0 
                ? 'bg-red-500/90 text-white' 
                : product.stock < 10 
                  ? 'bg-amber-500/90 text-white'
                  : 'bg-emerald-500/90 text-white'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.stock === 0 ? 'bg-red-200' : product.stock < 10 ? 'bg-amber-200' : 'bg-emerald-200'} animate-pulse`}></span>
              {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
            </span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-base font-bold text-slate-800 mb-3 truncate group-hover:text-indigo-600 transition-colors">{product.name}</h3>
        
        <div className="space-y-2 mb-5">
          {isCatalog && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">Min Price</span>
              <span className="font-bold text-slate-700">{formatCurrency(product.minPrice)}</span>
            </div>
          )}
          {!isCatalog && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400 font-medium">Price</span>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {formatCurrency(product.sellingPrice)}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onAction(product)}
          disabled={!isCatalog && product.stock === 0}
          className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
            !isCatalog && product.stock === 0 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : isCatalog
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isCatalog ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add to Shop
            </span>
          ) : product.stock === 0 ? 'Out of Stock' : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              Add to Cart
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
