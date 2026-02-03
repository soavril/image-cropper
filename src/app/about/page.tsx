import { Card } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서비스 소개',
  description: '제출사진 해결사 서비스 소개. 사진 업로드 오류를 빠르게 해결해드립니다.',
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">서비스 소개</h1>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          제출사진 해결사란?
        </h2>
        <p className="text-gray-600 mb-4">
          제출사진 해결사는 채용 사이트, 관공서 등에 사진을 제출할 때 발생하는
          업로드 오류를 빠르게 해결해드리는 무료 온라인 도구입니다.
        </p>
        <p className="text-gray-600">
          용량 초과, 규격 불일치, 포맷 오류 등 흔히 발생하는 문제를 자동으로
          감지하고 수정해드립니다.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          지원 플랫폼
        </h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <div>
              <span className="font-medium">잡코리아</span> - 이력서 증명사진
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <div>
              <span className="font-medium">사람인</span> - 이력서 증명사진
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <div>
              <span className="font-medium">운전면허증</span> - 면허 갱신/재발급용 사진
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <div>
              <span className="font-medium">신분증/주민등록증</span> - 증명사진
            </div>
          </li>
        </ul>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          주요 기능
        </h2>
        <ul className="space-y-2 text-gray-600">
          <li>• 자동 규격 검사 (크기, 용량, 비율, 포맷)</li>
          <li>• 스마트 리사이즈 (비율 유지)</li>
          <li>• 자동 압축 (품질 최적화)</li>
          <li>• 포맷 변환 (JPG/PNG)</li>
        </ul>
      </Card>

      <Card className="bg-amber-50 border-amber-100">
        <h2 className="text-xl font-semibold text-amber-800 mb-4">
          중요 안내
        </h2>
        <ul className="space-y-2 text-amber-700">
          <li>• 본 서비스는 사진 규격 변환을 도와드리는 보조 도구입니다.</li>
          <li>• 각 플랫폼의 실제 요구사항은 변경될 수 있습니다.</li>
          <li>• 통과 가능성을 높여드리지만, 100% 보장하지 않습니다.</li>
          <li>• 본 서비스는 해당 플랫폼과 제휴 관계가 없는 독립 서비스입니다.</li>
        </ul>
      </Card>
    </div>
  );
}
