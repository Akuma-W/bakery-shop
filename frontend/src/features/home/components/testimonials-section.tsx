'use client';

import React from 'react';
import { Heart, Star, Quote } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/locales/i18n-context';

/**
 * Customer testimonials section showcasing genuine feedback and community reviews.
 */
export function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    {
      nameKey: 'home_sections.review1_name',
      roleKey: 'home_sections.review1_role',
      commentKey: 'home_sections.review1_comment',
      initials: 'MT',
      rating: 5,
    },
    {
      nameKey: 'home_sections.review2_name',
      roleKey: 'home_sections.review2_role',
      commentKey: 'home_sections.review2_comment',
      initials: 'HN',
      rating: 5,
    },
    {
      nameKey: 'home_sections.review3_name',
      roleKey: 'home_sections.review3_role',
      commentKey: 'home_sections.review3_comment',
      initials: 'PL',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-bakery-50/60 to-amber-50/40 border-t border-bakery-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <Badge variant="secondary" className="px-3.5 py-1 text-xs">
            <Heart className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
            {t('home_sections.testimonials_badge')}
          </Badge>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-bakery-950">
            {t('home_sections.testimonials_title')}
          </h2>
          <p className="text-sm sm:text-base text-bakery-700 max-w-xl mx-auto">
            {t('home_sections.testimonials_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <Card
              key={index}
              className="relative bg-white border border-bakery-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-200" />
                </div>

                <p className="text-sm text-bakery-700 leading-relaxed italic mb-6">
                  &ldquo;{t(item.commentKey)}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-bakery-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-800">
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-bakery-950">{t(item.nameKey)}</h4>
                  <p className="text-xs text-bakery-500">{t(item.roleKey)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
