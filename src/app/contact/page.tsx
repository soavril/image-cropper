import { Card } from '@/components/ui/Card';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: '문의하기',
  description: '제출사진 해결사 문의 및 피드백',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">문의하기</h1>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          피드백 및 문의
        </h2>
        <p className="text-gray-600 mb-4">
          서비스 이용 중 문의사항이나 개선 제안이 있으시면 아래 이메일로
          연락해 주세요.
        </p>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm mb-1">이메일</p>
          <p className="text-gray-900 font-medium">{siteConfig.email}</p>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          자주 묻는 질문
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              Q. 사진이 서버에 저장되나요?
            </h3>
            <p className="text-gray-600 text-sm">
              아니요. 모든 이미지 처리는 브라우저에서만 이루어지며, 서버로
              전송되거나 저장되지 않습니다. 페이지를 닫으면 즉시 삭제됩니다.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              Q. 수정된 사진이 100% 통과되나요?
            </h3>
            <p className="text-gray-600 text-sm">
              본 도구는 통과 가능성을 높여드리지만, 각 플랫폼의 최종 심사 기준에
              따라 결과가 달라질 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              Q. 지원하는 파일 형식은?
            </h3>
            <p className="text-gray-600 text-sm">
              JPG와 PNG 형식을 지원합니다. 최대 10MB까지 업로드 가능합니다.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">
              Q. 모바일에서도 사용 가능한가요?
            </h3>
            <p className="text-gray-600 text-sm">
              네, 모바일 브라우저에서도 동일하게 이용 가능합니다.
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-blue-50 border-blue-100">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          버그 리포트
        </h2>
        <p className="text-blue-800">
          오류나 버그를 발견하셨다면 구체적인 상황(사용한 플랫폼, 파일 형식 등)과
          함께 알려주세요. 빠르게 수정하겠습니다.
        </p>
      </Card>
    </div>
  );
}
