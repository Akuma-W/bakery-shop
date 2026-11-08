import React from 'react';

import {
  HeroSection,
  FeaturedCategories,
  FreshBakesSection,
  BakerCraftSection,
  TestimonialsSection,
} from '@/features/home';

/**
 * Windie Cake Storefront Homepage composing modular storefront sections.
 */
export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturedCategories />
      <FreshBakesSection />
      <BakerCraftSection />
      <TestimonialsSection />
    </div>
  );
}
