import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <span className="font-bold text-gray-900">사진규격 맞춤</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/fix/jobkorea"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              잡코리아
            </Link>
            <Link
              href="/fix/saramin"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              사람인
            </Link>
            <Link
              href="/fix/drivers-license"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              운전면허증
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="메뉴 열기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
