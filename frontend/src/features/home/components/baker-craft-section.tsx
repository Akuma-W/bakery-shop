'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Clock, ShieldCheck, Flame } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/locales/i18n-context';

/**
 * Baker craft heritage section showcasing artisanal traditions and quality commitments.
 */
export function BakerCraftSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <Badge variant="secondary" className="px-3.5 py-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
            {t('home_sections.craft_badge')}
          </Badge>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-950 leading-tight">
            {t('home_sections.craft_title')}
          </h2>

          <p className="text-sm sm:text-base text-bakery-700 leading-relaxed font-sans">
            {t('home_sections.craft_desc')}
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold">
                <Clock className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-bakery-950">
                  {t('home_sections.craft_point1_title')}
                </h4>
                <p className="text-xs text-bakery-600 mt-1 leading-relaxed">
                  {t('home_sections.craft_point1_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-bakery-950">
                  {t('home_sections.craft_point2_title')}
                </h4>
                <p className="text-xs text-bakery-600 mt-1 leading-relaxed">
                  {t('home_sections.craft_point2_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold">
                <Flame className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-bakery-950">
                  {t('home_sections.craft_point3_title')}
                </h4>
                <p className="text-xs text-bakery-600 mt-1 leading-relaxed">
                  {t('home_sections.craft_point3_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-bakery-200">
            <Image
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80"
              alt="Flaky laminated croissant layers"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-bakery-200 mt-8">
            <Image
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
              alt="Artisan sourdough loaf scoring"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
