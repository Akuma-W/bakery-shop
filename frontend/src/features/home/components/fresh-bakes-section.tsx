'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTE_PRODUCTS } from '@/constants/APP_ROUTES';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/locales/i18n-context';
import { ProductCard } from '@/features/products';
import { productsService } from '@/services/products.service';
import { categoriesService } from '@/services/categories.service';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

/**
 * Daily fresh bakes grid component featuring category filter tabs, product cards, and loading skeletons.
 */
export function FreshBakesSection() {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Loads category list on initial mount.
   */
  useEffect(() => {
    let isMounted = true;
    categoriesService
      .getCategories()
      .then((data) => {
        if (isMounted && data) {
          setCategories(data);
        }
      })
      .catch(() => {
        // Handled silently by service fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Fetches fresh products whenever category filter tab changes.
   */
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const filterParams = {
      categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
      limit: 8,
    };

    productsService
      .getProducts(filterParams)
      .then((res) => {
        if (isMounted && res?.items) {
          setProducts(res.items);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <section className="py-16 bg-gradient-to-b from-bakery-50/70 to-white border-y border-bakery-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <Badge variant="default" className="px-3 py-1 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
              {t('home_sections.fresh_bakes_badge')}
            </Badge>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-bakery-950">
              {t('home_sections.fresh_bakes_title')}
            </h2>
            <p className="text-sm sm:text-base text-bakery-700 max-w-2xl">
              {t('home_sections.fresh_bakes_desc')}
            </p>
          </div>

          <Link href={ROUTE_PRODUCTS} className="shrink-0">
            <Button
              variant="outline"
              className="font-semibold text-sm border-bakery-300 hover:bg-amber-50 cursor-pointer"
            >
              {t('home_sections.view_all_products')}
              <ArrowRight className="w-4 h-4 ml-2 text-amber-800" />
            </Button>
          </Link>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 scrollbar-none mb-8">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold transition-all shrink-0 cursor-pointer border',
              selectedCategory === 'all'
                ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                : 'bg-white text-bakery-800 border-bakery-200 hover:border-amber-400 hover:bg-amber-50/50',
            )}
          >
            {t('home_sections.category_filter_all')}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold transition-all shrink-0 cursor-pointer border',
                selectedCategory === cat.slug
                  ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                  : 'bg-white text-bakery-800 border-bakery-200 hover:border-amber-400 hover:bg-amber-50/50',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-bakery-200 bg-white p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-square w-full rounded-xl bg-bakery-200/60" />
                <div className="h-4 bg-bakery-200/60 rounded w-1/3" />
                <div className="h-5 bg-bakery-200/60 rounded w-3/4" />
                <div className="h-4 bg-bakery-200/60 rounded w-full" />
                <div className="pt-2 flex justify-between items-center">
                  <div className="h-6 bg-bakery-200/60 rounded w-20" />
                  <div className="h-9 bg-bakery-200/60 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-bakery-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="font-serif text-lg font-bold text-bakery-900">
              {t('home_sections.empty_filtered_products')}
            </h3>
            <Link href={ROUTE_PRODUCTS} className="inline-block mt-4">
              <Button variant="default" className="text-sm font-semibold">
                {t('home_sections.view_all_products')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
