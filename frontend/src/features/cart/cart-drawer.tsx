'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck } from 'lucide-react';

import { useCartStore } from '@/stores/cart.store';
import { useTranslation } from '@/locales/i18n-context';
import { formatCurrency } from '@/lib/utils';
import { ROUTE_CHECKOUT, ROUTE_PRODUCTS, ROUTE_CART } from '@/constants/APP_ROUTES';
import { FREE_SHIPPING_THRESHOLD } from '@/constants/SITE_CONFIG';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

/**
 * Slide-over Cart Drawer displaying active items, quantity controls, and free shipping progress.
 */
export function CartDrawer() {
  const { t } = useTranslation();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
    isFreeShipping,
    getFreeShippingGap,
  } = useCartStore();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const qualifiesForFreeShipping = isFreeShipping();
  const shippingGap = getFreeShippingGap();
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 bg-bakery-50 text-bakery-950 border-l border-bakery-200"
      >
        {/* Drawer Header */}
        <SheetHeader className="px-6 py-4 bg-white border-b border-bakery-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-serif font-bold text-bakery-950">
                {t('cart.title')}
              </SheetTitle>
              <p className="text-xs text-bakery-600 font-sans mt-0.5">
                {t('cart.items_count', { count: totalItems })}
              </p>
            </div>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {qualifiesForFreeShipping
                  ? t('cart.free_shipping_eligible')
                  : t('cart.free_shipping_gap', { gap: formatCurrency(shippingGap) })}
              </span>
            </div>
            <div className="mt-2 w-full h-2 rounded-full bg-amber-200/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-700 transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Drawer Scrollable Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-bakery-200">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100/70 flex items-center justify-center text-amber-700 mb-4 border border-amber-200">
                <ShoppingBag className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="font-serif font-semibold text-base text-bakery-900">
                {t('cart.empty_title')}
              </h3>
              <p className="text-xs text-bakery-600 max-w-xs mt-1 leading-relaxed">
                {t('cart.empty_desc')}
              </p>
              <Link href={ROUTE_PRODUCTS} onClick={closeDrawer}>
                <Button variant="default" size="default" className="mt-6 font-semibold">
                  {t('cart.continue_shopping')}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                {/* Product Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-bakery-200 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Details & Counter */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeDrawer}
                        className="text-sm font-semibold text-bakery-950 hover:text-amber-700 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-bakery-400 hover:text-rose-600 transition-colors p-1"
                        aria-label={t('cart.remove_item')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm font-bold text-amber-800 mt-0.5">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="inline-flex items-center border border-bakery-300 rounded-lg bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 text-bakery-600 hover:text-bakery-950 transition-colors disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-bakery-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.stock}
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 text-bakery-600 hover:text-bakery-950 transition-colors disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-bakery-500 font-sans ml-auto">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Checkout CTA */}
        {items.length > 0 && (
          <SheetFooter className="p-6 bg-white border-t border-bakery-200 flex flex-col gap-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-bakery-700">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-bakery-950">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-bakery-700">
                <span>{t('cart.shipping')}</span>
                <span className="text-xs font-medium text-amber-800">
                  {qualifiesForFreeShipping
                    ? t('cart.shipping_free')
                    : t('cart.shipping_calculated')}
                </span>
              </div>
              <Separator className="my-2 bg-bakery-200" />
              <div className="flex justify-between text-base font-bold text-bakery-950">
                <span>{t('cart.total')}</span>
                <span className="text-amber-800 text-lg">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link href={ROUTE_CHECKOUT} onClick={closeDrawer} className="w-full">
                <Button variant="default" size="lg" className="w-full font-bold shadow-md">
                  {t('cart.checkout')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href={ROUTE_CART} onClick={closeDrawer} className="w-full">
                <Button variant="outline" size="default" className="w-full font-medium">
                  {t('cart.view_cart')}
                </Button>
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
