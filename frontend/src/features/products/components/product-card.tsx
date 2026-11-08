'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Clock, Sparkles } from 'lucide-react';

import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatCurrency, cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import { useTranslation } from '@/locales/i18n-context';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

/**
 * Reusable product card component showcasing imagery, pricing, badges, and quick-add action.
 */
export function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useTranslation();
  const { addItem } = useCartStore();

  const isSoldOut = product.stock <= 0;
  const isLowStock = !isSoldOut && product.stock <= 5;
  const hasDiscount =
    product.originalPrice !== null &&
    product.originalPrice !== undefined &&
    product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';

  /**
   * Adds product item to global cart and triggers cart drawer.
   */
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSoldOut) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: displayImage,
      stock: product.stock,
    });
  };

  return (
    <Card
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-bakery-200/90 hover:border-amber-300 hover:shadow-xl transition-all duration-300 p-0',
        className,
      )}
    >
      <div>
        {/* Product Media Area */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block w-full aspect-square overflow-hidden bg-bakery-100"
        >
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges Container */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 pointer-events-none">
            <div className="flex flex-col gap-1.5 items-start">
              {hasDiscount && (
                <Badge variant="destructive" className="font-bold text-xs shadow-xs">
                  {t('product.discount_tag', { percent: discountPercent })}
                </Badge>
              )}
              {product.isFeatured && (
                <Badge variant="default" className="font-semibold text-xs shadow-xs">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-700" />
                  {t('product.bestseller')}
                </Badge>
              )}
            </div>

            {isSoldOut ? (
              <Badge variant="destructive" className="font-semibold text-xs shadow-xs">
                {t('product.sold_out')}
              </Badge>
            ) : isLowStock ? (
              <Badge variant="secondary" className="font-semibold text-xs shadow-xs">
                {t('product.low_stock', { count: product.stock })}
              </Badge>
            ) : null}
          </div>

          {/* Prep Time Tag */}
          {product.prepTimeMinutes && (
            <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>{t('product.prep_time', { minutes: product.prepTimeMinutes })}</span>
            </div>
          )}
        </Link>

        {/* Product Information Body */}
        <div className="p-4 sm:p-5 flex flex-col space-y-2">
          {product.category?.name && (
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
              {product.category.name}
            </span>
          )}

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-serif text-base font-bold text-bakery-950 group-hover:text-amber-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-bakery-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="p-4 sm:p-5 pt-0 mt-auto border-t border-bakery-100 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-base font-bold text-amber-800">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-bakery-400 line-through">
              {formatCurrency(product.originalPrice!)}
            </span>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          disabled={isSoldOut}
          onClick={handleQuickAdd}
          className={cn(
            'text-sm font-semibold transition-all shadow-xs cursor-pointer',
            isSoldOut
              ? 'opacity-50 cursor-not-allowed bg-bakery-200 text-bakery-500'
              : 'bg-amber-700 hover:bg-amber-800 text-white',
          )}
          aria-label={t('product.add_to_cart')}
        >
          <ShoppingBag className="w-4 h-4 mr-1.5" />
          {isSoldOut ? t('product.sold_out') : t('product.add_to_cart')}
        </Button>
      </div>
    </Card>
  );
}
