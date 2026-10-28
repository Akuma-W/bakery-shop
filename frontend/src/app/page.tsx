import { CheckCircle2, Server, Database, ShieldCheck, CreditCard, BellRing } from 'lucide-react';

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Monorepo Foundation Ready
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-bakery-950">
          Bakery Web Platform
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-bakery-700">
          Nền tảng thương mại điện tử chuyên biệt cho tiệm bánh thủ công, đồ uống và phụ kiện tiệc.
          Được xây dựng với kiến trúc phân tách độc lập, hiệu năng cao và chi phí tối ưu.
        </p>
      </div>

      {/* Tech Stack Cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-bakery-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-bakery-900">Frontend (Next.js 15)</h3>
          <p className="mt-2 text-sm text-bakery-700 leading-relaxed">
            App Router, React 19, Tailwind CSS, TypeScript strict mode. Hỗ trợ SSR, ISR và Mobile-first responsive.
          </p>
          <div className="mt-4 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
            Port: 3000
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-bakery-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 mb-4">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-bakery-900">Backend (NestJS 10)</h3>
          <p className="mt-2 text-sm text-bakery-700 leading-relaxed">
            RESTful API với tiền tố <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">/api/v1</code>, Validation Pipe, Exception Filter và Swagger Docs.
          </p>
          <div className="mt-4 text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
            Port: 3001
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-bakery-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-800 mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-bakery-900">PostgreSQL + Prisma</h3>
          <p className="mt-2 text-sm text-bakery-700 leading-relaxed">
            Cơ sở dữ liệu quan hệ chạy cục bộ qua Docker Compose (Postgres 16 Alpine), Prisma ORM type-safe client.
          </p>
          <div className="mt-4 text-xs font-semibold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md inline-block">
            Port: 5432
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-bakery-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 mb-4">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-bakery-900">PayOS Sandbox</h3>
          <p className="mt-2 text-sm text-bakery-700 leading-relaxed">
            Hỗ trợ tạo link thanh toán VietQR động và xác thực webhook HMAC Checksum chống giả mạo và bảo đảm Idempotency.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-bakery-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800 mb-4">
            <BellRing className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-bakery-900">System Notifications</h3>
          <p className="mt-2 text-sm text-bakery-700 leading-relaxed">
            Thông báo trạng thái đơn hàng cho khách và chuông báo động đơn mới kèm âm thanh cho bếp chủ tiệm.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-bakery-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-800 mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-bakery-900">Concurrency Safety</h3>
          <p className="mt-2 text-sm text-bakery-700 leading-relaxed">
            Trừ tồn kho nguyên tử bằng Row Guard trong Prisma Transaction để loại bỏ hoàn toàn nguy cơ Overselling.
          </p>
        </div>
      </div>

      {/* Quick Links & Health Status */}
      <div className="mt-12 p-8 rounded-3xl bg-white border border-bakery-200 shadow-sm">
        <h2 className="text-xl font-bold text-bakery-950">Đường dẫn kiểm tra nhanh</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <a
            href="http://localhost:3001/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-bakery-800 hover:bg-bakery-900 transition shadow-sm"
          >
            Mở Swagger Docs
          </a>
          <a
            href={`${apiUrl}/health`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-bakery-800 bg-bakery-100 hover:bg-bakery-200 transition border border-bakery-300"
          >
            Kiểm tra Health Endpoint
          </a>
        </div>
      </div>
    </main>
  );
}
