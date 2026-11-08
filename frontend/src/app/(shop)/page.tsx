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
 * Windie Cake Storefront Homepage featuring bilingual hero showcase, trust badges, and featured categories.
 */
export default function HomePage() {
  const { t } = useTranslation();
  const { addItem } = useCartStore();

  const handleQuickAdd = (
    e: React.MouseEvent,
    item: {
      productId: string;
      name: string;
      slug: string;
      price: number;
      image: string;
      stock: number;
    },
  ) => {
    e.preventDefault();
    addItem(item);
  };

  const categories = [
    {
      titleKey: 'categories_section.cat_bread',
      slug: 'banh-mi-artisan',
      count: 12,
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleKey: 'categories_section.cat_pastry',
      slug: 'banh-ngot-pastry',
      count: 16,
      img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleKey: 'categories_section.cat_cake',
      slug: 'banh-kem-sinh-nhat',
      count: 8,
      img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleKey: 'categories_section.cat_beverage',
      slug: 'do-uong-tra-tuoi',
      count: 10,
      img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Showcase Section */}
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
                    className="w-full sm:w-auto font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-md"
                  >
                    {t('hero.cta_explore')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href={ROUTE_ABOUT} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto font-semibold border-bakery-300 text-bakery-900 hover:bg-amber-50"
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

              {/* Best Seller Card: fully responsive (bottom inset on mobile, floating on desktop) */}
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
                  onClick={(e) =>
                    handleQuickAdd(e, {
                      productId: 'prod-1',
                      name: 'Bánh Sừng Bò Bơ Pháp (Classic Croissant)',
                      slug: 'banh-sung-bo-bo-phap-classic-croissant',
                      price: 35000,
                      image:
                        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
                      stock: 25,
                    })
                  }
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

      {/* Featured Categories Grid Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="secondary" className="px-3 py-1">
            {t('categories_section.badge')}
          </Badge>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-bakery-950">
            {t('categories_section.title')}
          </h2>
          <p className="text-sm sm:text-base text-bakery-700 max-w-xl mx-auto">
            {t('categories_section.description')}
          </p>
        </div>

        {/* Categories Grid with verified fill, explicit height and aspect ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`${ROUTE_PRODUCTS}?categorySlug=${cat.slug}`}
              className="group relative w-full aspect-[4/3] min-h-[200px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-bakery-200 block"
            >
              <Image
                src={cat.img}
                alt={t(cat.titleKey)}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                <span className="text-xs text-amber-300 font-medium">
                  {t('categories_section.items_suffix', { count: cat.count })}
                </span>
                <h3 className="font-serif text-lg font-bold mt-0.5 group-hover:text-amber-200 transition-colors">
                  {t(cat.titleKey)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
