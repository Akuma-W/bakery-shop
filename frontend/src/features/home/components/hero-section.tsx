'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Award, Clock, Heart, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTE_PRODUCTS, ROUTE_ABOUT } from '@/constants/APP_ROUTES';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import { useTranslation } from '@/locales/i18n-context';

/**
 * Hero showcase section featuring brand statement, trust badges, and best seller preview.
 */
export function HeroSection() {
  const { t } = useTranslation();
  const { addItem } = useCartStore();

  /**
   * Adds the hero best seller croissant item directly into cart.
   */
  const handleHeroQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: 'prod-1',
      name: 'Bánh Sừng Bò Bơ Pháp (Classic Croissant)',
      slug: 'banh-sung-bo-bo-phap-classic-croissant',
      price: 35000,
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
      stock: 25,
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-bakery-50 to-white py-12 sm:py-20 border-b border-bakery-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Headline & Call to Action */}
          <div className="space-y-6 text-center lg:text-left">
            <Badge variant="default" className="px-3.5 py-1 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
              {t('hero.badge')}
            </Badge>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-bakery-950 leading-[1.15]">
              {t('hero.title_line1')} <br />
              <span className="text-amber-800 italic">{t('hero.title_line2')}</span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg text-bakery-700 leading-relaxed font-sans">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href={ROUTE_PRODUCTS} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-md text-sm cursor-pointer"
                >
                  {t('hero.cta_explore')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href={ROUTE_ABOUT} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-semibold border-bakery-300 text-bakery-900 hover:bg-amber-50 text-sm cursor-pointer"
                >
                  {t('hero.cta_about')}
                </Button>
              </Link>
            </div>

            {/* Fully Responsive Trust Badges */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-bakery-200/80">
              <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 p-3 sm:p-0 rounded-xl bg-amber-50/70 sm:bg-transparent border sm:border-0 border-amber-200/60">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Award className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>{t('hero.badge1_title')}</span>
                </div>
                <p className="text-xs text-bakery-600 sm:mt-1">{t('hero.badge1_desc')}</p>
              </div>

              <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 p-3 sm:p-0 rounded-xl bg-amber-50/70 sm:bg-transparent border sm:border-0 border-amber-200/60">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Clock className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>{t('hero.badge2_title')}</span>
                </div>
                <p className="text-xs text-bakery-600 sm:mt-1">{t('hero.badge2_desc')}</p>
              </div>

              <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 p-3 sm:p-0 rounded-xl bg-amber-50/70 sm:bg-transparent border sm:border-0 border-amber-200/60">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Heart className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>{t('hero.badge3_title')}</span>
                </div>
                <p className="text-xs text-bakery-600 sm:mt-1">{t('hero.badge3_desc')}</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual & Best Seller Card */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative w-full aspect-[4/3] min-h-[260px] sm:min-h-[360px] lg:min-h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-bakery-100">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=85"
                alt="Windie Cake Artisanal Breads"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Best Seller Card: fully responsive */}
            <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-bakery-200 w-full sm:max-w-xs flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-bakery-200 bg-bakery-100">
                <Image
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&auto=format&fit=crop&q=80"
                  alt="Croissant"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                  {t('hero.best_seller_tag')}
                </div>
                <div className="text-sm font-bold text-bakery-950 truncate">
                  {t('hero.best_seller_name')}
                </div>
                <div className="text-xs font-extrabold text-amber-700 mt-0.5">
                  {formatCurrency(35000)}
                </div>
              </div>
              <button
                type="button"
                onClick={handleHeroQuickAdd}
                className="p-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white transition-colors cursor-pointer shrink-0"
                aria-label={t('hero.quick_add')}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
