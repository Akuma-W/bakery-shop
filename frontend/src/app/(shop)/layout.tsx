import React from 'react';

import { I18nProvider } from '@/locales/i18n-context';
import { ShopHeader } from '@/components/layout/shop-header';
import { ShopFooter } from '@/components/layout/shop-footer';
import { CartDrawer } from '@/features/cart/cart-drawer';

interface ShopLayoutProps {
  children: React.ReactNode;
}

/**
 * Root storefront layout encompassing sticky navigation, slide-over cart drawer, and footer.
 */
export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-bakery-50 text-bakery-950">
        <ShopHeader />
        <CartDrawer />
        <main className="flex-1 w-full">{children}</main>
        <ShopFooter />
      </div>
    </I18nProvider>
  );
}
