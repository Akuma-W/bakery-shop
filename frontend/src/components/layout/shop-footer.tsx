'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, Heart } from 'lucide-react';

import { Logo } from '@/components/common/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/locales/i18n-context';
import { STORE_HOTLINE, STORE_EMAIL, SITE_NAME } from '@/constants/SITE_CONFIG';
import { ROUTE_PRODUCTS, ROUTE_ABOUT } from '@/constants/APP_ROUTES';

/**
 * Main Storefront Footer displaying brand story, contact coordinates, quick catalog links, and newsletter.
 */
export function ShopFooter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bakery-950 text-bakery-200 border-t border-bakery-900 mt-auto">
      {/* Upper Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand Info & Story */}
          <div className="space-y-4">
            <Logo size="md" variant="dark" />
            <p className="text-xs sm:text-sm text-bakery-400 leading-relaxed font-sans">
              {t('footer.about_desc')}
            </p>
            <div className="space-y-2.5 text-xs text-bakery-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('site.address')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${STORE_HOTLINE}`} className="hover:text-amber-300 transition-colors">
                  {STORE_HOTLINE}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="hover:text-amber-300 transition-colors"
                >
                  {STORE_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('site.hours')}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Categories Menu */}
          <div>
            <h4 className="font-serif text-base font-bold text-white tracking-wide mb-4">
              {t('footer.menu_title')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-bakery-400">
              <li>
                <Link
                  href={`${ROUTE_PRODUCTS}?categorySlug=banh-mi-artisan`}
                  className="hover:text-amber-300 transition-colors"
                >
                  <span>{t('footer.category_bread')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTE_PRODUCTS}?categorySlug=banh-ngot-pastry`}
                  className="hover:text-amber-300 transition-colors"
                >
                  <span>{t('footer.category_pastry')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTE_PRODUCTS}?categorySlug=banh-kem-sinh-nhat`}
                  className="hover:text-amber-300 transition-colors"
                >
                  <span>{t('footer.category_cake')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTE_PRODUCTS}?categorySlug=do-uong-tra-tuoi`}
                  className="hover:text-amber-300 transition-colors"
                >
                  <span>{t('footer.category_beverage')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`${ROUTE_PRODUCTS}?isFeatured=true`}
                  className="text-amber-400 font-medium hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{t('footer.featured_products')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care Policies */}
          <div>
            <h4 className="font-serif text-base font-bold text-white tracking-wide mb-4">
              {t('footer.support_title')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-bakery-400">
              <li>
                <Link href="/policy/shipping" className="hover:text-amber-300 transition-colors">
                  {t('footer.policy_shipping')}
                </Link>
              </li>
              <li>
                <Link href="/policy/refund" className="hover:text-amber-300 transition-colors">
                  {t('footer.policy_refund')}
                </Link>
              </li>
              <li>
                <Link href="/policy/privacy" className="hover:text-amber-300 transition-colors">
                  {t('footer.policy_privacy')}
                </Link>
              </li>
              <li>
                <Link href="/policy/terms" className="hover:text-amber-300 transition-colors">
                  {t('footer.policy_terms')}
                </Link>
              </li>
              <li>
                <Link href={ROUTE_ABOUT} className="hover:text-amber-300 transition-colors">
                  {t('footer.baker_story')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Payment trust */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              {t('footer.newsletter_title')}
            </h4>
            <p className="text-xs text-bakery-400 leading-relaxed font-sans">
              {t('footer.newsletter_desc')}
            </p>

            {isSubscribed ? (
              <div className="p-3 rounded-xl bg-amber-900/50 border border-amber-600/50 text-xs font-medium text-amber-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('footer.newsletter_success')}</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  required
                  placeholder={t('footer.newsletter_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-bakery-900 border-bakery-800 text-white placeholder:text-bakery-500 focus:border-amber-500"
                />
                <Button
                  type="submit"
                  variant="default"
                  size="default"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {t('footer.newsletter_button')}
                </Button>
              </form>
            )}

            {/* Payment Methods Badges */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-bakery-500 font-bold block mb-2">
                {t('footer.payment_methods')}
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-md bg-bakery-900 border border-bakery-800 text-bakery-300">
                  VietQR
                </span>
                <span className="px-2.5 py-1 rounded-md bg-bakery-900 border border-bakery-800 text-bakery-300">
                  PayOS
                </span>
                <span className="px-2.5 py-1 rounded-md bg-bakery-900 border border-bakery-800 text-bakery-300">
                  <span>{t('footer.cod_payment')}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-bakery-900 py-6 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-bakery-500">
          <p>
            © {currentYear} {SITE_NAME}. {t('footer.rights_reserved')}
          </p>
          <p className="flex items-center gap-1.5 text-bakery-400">
            {t('footer.baked_with_love')}{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
