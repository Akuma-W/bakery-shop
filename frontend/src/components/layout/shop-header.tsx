'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  Phone,
  Clock,
  Globe,
  Bell,
  X,
  Sparkles,
} from 'lucide-react';

import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { useCartStore } from '@/stores/cart.store';
import { useTranslation } from '@/locales/i18n-context';
import { ROUTE_HOME, ROUTE_PRODUCTS, ROUTE_ABOUT, ROUTE_LOGIN } from '@/constants/APP_ROUTES';
import { STORE_HOTLINE } from '@/constants/SITE_CONFIG';

/**
 * Main Storefront Header featuring responsive navigation, language switch, search bar, and cart badge.
 */
export function ShopHeader() {
  const router = useRouter();
  const { t, locale, toggleLocale } = useTranslation();
  const { openDrawer, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`${ROUTE_PRODUCTS}?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: t('nav.home'), href: ROUTE_HOME },
    { label: t('nav.menu'), href: ROUTE_PRODUCTS },
    { label: t('nav.featured'), href: `${ROUTE_PRODUCTS}?isFeatured=true` },
    { label: t('nav.about'), href: ROUTE_ABOUT },
  ];

  return (
    <header className="sticky top-0 z-40 w-full select-none shadow-xs">
      {/* Top Notification & Utility Bar */}
      <div className="w-full bg-bakery-950 text-bakery-200 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-bakery-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Announcement */}
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 font-medium text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              {t('topbar.announcement')}
            </span>
          </div>

          {/* Right Store Info & Language Selector */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="hidden md:flex items-center gap-4 text-bakery-400">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                {STORE_HOTLINE}
              </span>
              <span className="hidden lg:inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {t('site.hours')}
              </span>
            </div>

            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-bakery-900 hover:bg-bakery-800 text-bakery-200 border border-bakery-700 transition-colors font-medium cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span className="uppercase text-[11px] font-bold">
                {locale === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b border-bakery-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Trigger + Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-bakery-800 hover:bg-bakery-100 transition-colors cursor-pointer"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-4/5 sm:max-w-xs bg-bakery-50 text-bakery-950 flex flex-col p-6"
              >
                <SheetHeader className="text-left p-0 pb-4 border-b border-bakery-200">
                  <Logo size="sm" />
                </SheetHeader>

                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="mt-6">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder={t('nav.search_placeholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 bg-white"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-bakery-500 hover:text-amber-800"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Mobile Navigation List */}
                <nav className="mt-6 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-semibold text-bakery-900 hover:bg-bakery-100 hover:text-amber-800 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Footer Info */}
                <div className="mt-auto pt-6 border-t border-bakery-200 text-xs text-bakery-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-700" />
                    <span>{STORE_HOTLINE}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>{t('site.hours')}</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Brand Logo with W Emblem */}
            <Logo size="md" />
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-bakery-800 hover:text-amber-800 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-700 hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search & Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop Quick Search */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block w-48 lg:w-64">
              <div className="relative">
                <Input
                  type="search"
                  placeholder={t('nav.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 pr-9 bg-bakery-50/70 border-bakery-300 focus:bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bakery-500 hover:text-amber-800 transition-colors"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* User Account Button */}
            <Link href={ROUTE_LOGIN} aria-label={t('nav.account')}>
              <Button
                variant="ghost"
                size="icon"
                className="text-bakery-800 hover:bg-bakery-100 rounded-xl"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>

            {/* Shopping Cart Button with Dynamic Badge */}
            <Button
              variant="default"
              size="default"
              onClick={openDrawer}
              className="relative rounded-xl font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-sm gap-2 px-3 sm:px-4"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-semibold">{t('nav.cart')}</span>
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-white text-amber-900 shadow-2xs">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
