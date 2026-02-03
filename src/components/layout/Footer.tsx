import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
          <Link
            href="/about"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            서비스 소개
          </Link>
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/terms"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            이용약관
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            문의하기
          </Link>
        </div>

        {/* Trust Message */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            🔒 업로드한 사진은 서버에 저장되지 않습니다
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p>© 2026 사진규격 맞춤. All rights reserved.</p>
          <p className="mt-1">
            본 서비스는 각 플랫폼과 제휴 관계가 없는 독립 서비스입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
