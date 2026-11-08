'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { ROUTE_PRODUCTS } from '@/constants/APP_ROUTES';
import { useTranslation } from '@/locales/i18n-context';

/**
 * Featured categories grid section highlighting primary pastry and bakery offerings.
 */
export function FeaturedCategories() {
  const { t } = useTranslation();

  const categoryCards = [
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
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <Badge variant="secondary" className="px-3 py-1 text-xs">
          {t('categories_section.badge')}
        </Badge>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-bakery-950">
          {t('categories_section.title')}
        </h2>
        <p className="text-sm sm:text-base text-bakery-700 max-w-xl mx-auto">
          {t('categories_section.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryCards.map((cat) => (
          <Link
            key={cat.slug}
            href={`${ROUTE_PRODUCTS}?categorySlug=${cat.slug}`}
            className="group relative w-full aspect-[4/3] min-h-[200px] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-bakery-200 block"
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
  );
}
