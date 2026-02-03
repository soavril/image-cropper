import { Card } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '제출사진 해결사 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">개인정보처리방침</h1>

      <Card className="mb-6">
        <p className="text-gray-600 mb-4">
          제출사진 해결사(이하 &quot;서비스&quot;)는 이용자의 개인정보를
          중요시하며, 개인정보보호법 등 관련 법령을 준수합니다.
        </p>
        <p className="text-sm text-gray-500">최종 수정일: 2026년 2월</p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          1. 수집하는 개인정보
        </h2>
        <p className="text-gray-600 mb-3">
          본 서비스는 회원가입 없이 이용 가능하며, 다음 정보만 자동으로 수집될 수
          있습니다:
        </p>
        <ul className="text-gray-600 space-y-1 ml-4">
          <li>• 접속 로그 (IP 주소, 접속 시간)</li>
          <li>• 브라우저 및 기기 정보</li>
          <li>• 서비스 이용 기록</li>
        </ul>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-green-700 font-medium">
            🔒 중요: 업로드하시는 사진은 서버에 전송되거나 저장되지 않습니다.
          </p>
          <p className="text-green-600 text-sm mt-2">
            모든 이미지 처리는 사용자의 브라우저에서만 이루어지며, 페이지를 닫으면
            즉시 삭제됩니다.
          </p>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          2. 개인정보의 이용 목적
        </h2>
        <ul className="text-gray-600 space-y-1 ml-4">
          <li>• 서비스 제공 및 개선</li>
          <li>• 이용 통계 분석</li>
          <li>• 문의 응대</li>
        </ul>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          3. 쿠키 및 분석 도구
        </h2>
        <p className="text-gray-600 mb-3">
          본 서비스는 다음 도구를 사용할 수 있습니다:
        </p>
        <ul className="text-gray-600 space-y-2 ml-4">
          <li>• <strong>Google Analytics</strong> - 서비스 이용 통계 분석</li>
          <li>• <strong>Google AdSense</strong> - 광고 제공</li>
        </ul>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            Google AdSense 광고 및 쿠키
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            본 서비스는 Google AdSense를 통해 광고를 게재합니다. Google은 쿠키를
            사용하여 이용자의 관심사에 기반한 맞춤형 광고를 제공할 수 있습니다.
          </p>
          <p className="text-gray-600 text-sm">
            맞춤 광고 비활성화:{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google 광고 설정
            </a>
          </p>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          4. 개인정보의 보유 및 파기
        </h2>
        <p className="text-gray-600">
          수집된 정보는 이용 목적 달성 후 지체 없이 파기됩니다. 접속 로그는
          최대 1년간 보관 후 자동 삭제됩니다.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          5. 제3자 제공
        </h2>
        <p className="text-gray-600">
          본 서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에
          따라 요청되는 경우는 예외로 합니다.
        </p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          6. 문의처
        </h2>
        <p className="text-gray-600">
          개인정보 관련 문의는{' '}
          <a href="/contact" className="text-blue-600 hover:underline">
            문의하기
          </a>{' '}
          페이지를 이용해 주세요.
        </p>
      </Card>
    </div>
  );
}
