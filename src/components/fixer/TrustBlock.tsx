import { Card } from '@/components/ui/Card';

export function TrustBlock() {
  return (
    <Card className="bg-gray-50 border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🔒</span>
        <h3 className="font-semibold text-gray-900">개인정보 보호</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-white rounded-lg">
          <div className="text-2xl mb-1">🚫</div>
          <p className="text-xs text-gray-600">서버 저장 없음</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg">
          <div className="text-2xl mb-1">💻</div>
          <p className="text-xs text-gray-600">브라우저 내 처리</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg">
          <div className="text-2xl mb-1">🗑️</div>
          <p className="text-xs text-gray-600">즉시 삭제</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed">
        업로드한 사진은 서버로 전송되지 않습니다. 모든 처리는 사용자의
        브라우저에서만 이루어지며, 페이지를 닫으면 즉시 삭제됩니다.
      </p>
    </Card>
  );
}
