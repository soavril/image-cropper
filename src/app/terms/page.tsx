import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
  description: '사진규격 맞춤 서비스 이용약관',
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">이용약관</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <p className="text-gray-600 mb-4">
          사진규격 맞춤(이하 &quot;서비스&quot;)을 이용해 주셔서 감사합니다.
          본 서비스 이용 전 아래 약관을 확인해 주세요.
        </p>
        <p className="text-sm text-gray-500">최종 수정일: 2025년 2월</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          1. 서비스 목적
        </h2>
        <p className="text-gray-600 mb-3">
          본 서비스는 사진의 규격(크기, 용량)을 변환하는 <strong>무료 도구</strong>입니다.
        </p>
        <p className="text-gray-600">
          모든 이미지 처리는 사용자의 브라우저에서만 이루어지며, 서버로 업로드되지 않습니다.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-yellow-400">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          2. 면책 조항
        </h2>
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <p className="text-yellow-800 font-semibold">
            본 서비스의 결과물은 참고용이며, 모든 사이트/기관에서의 승인을 보장하지 않습니다.
          </p>
        </div>
        <ul className="text-gray-600 space-y-2 ml-4">
          <li>• 각 사이트/기관의 사진 규격 요구사항은 변경될 수 있습니다.</li>
          <li>• 변환된 사진이 특정 사이트에서 거부될 수 있습니다.</li>
          <li>• 정확한 규격 요구사항은 해당 사이트/기관에 직접 문의하세요.</li>
        </ul>
        <p className="text-gray-600 mt-4">
          본 사이트 이용으로 인해 발생하는 어떠한 손해에 대해서도 운영자는 책임을 지지 않습니다.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          3. 이미지 처리
        </h2>
        <ul className="text-gray-600 space-y-2 ml-4">
          <li>• 모든 이미지 처리는 브라우저 내에서만 이루어집니다.</li>
          <li>• 업로드한 이미지는 서버에 저장되지 않습니다.</li>
          <li>• 페이지를 닫으면 모든 이미지 데이터가 삭제됩니다.</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          4. 지적재산권
        </h2>
        <p className="text-gray-600">
          본 사이트의 디자인, 코드, 콘텐츠에 대한 저작권은 운영자에게 있습니다.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          5. 약관 변경
        </h2>
        <p className="text-gray-600">
          본 이용약관은 필요에 따라 변경될 수 있으며, 변경 시 이 페이지에 게시합니다.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          6. 문의처
        </h2>
        <p className="text-gray-600">
          서비스 관련 문의: <a href="mailto:soavril@naver.com" className="text-blue-600 hover:underline">soavril@naver.com</a>
        </p>
      </div>
    </div>
  );
}
