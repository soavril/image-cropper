'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { PlatformConfig } from '@/lib/platforms/config';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ManualFrameEditorProps {
  canvas: HTMLCanvasElement;
  platform: PlatformConfig;
  onConfirm: (cropArea: CropArea) => void;
  onCancel: () => void;
}

export interface CropArea {
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

interface EditorState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Phase 1.5: Manual Frame Editor
 *
 * 핵심 원칙:
 * - 프레임은 고정 (목표 비율)
 * - 사용자가 이미지를 드래그/줌하여 위치 조정
 * - 이미지는 항상 프레임을 완전히 덮어야 함 (빈 공간 금지)
 */
export function ManualFrameEditor({
  canvas,
  platform,
  onConfirm,
  onCancel,
}: ManualFrameEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 에디터 상태
  const [state, setState] = useState<EditorState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });

  // 드래그 상태
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const [lastPinchDistance, setLastPinchDistance] = useState(0);

  // 프레임 및 이미지 크기
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // 목표 비율 계산
  const targetRatio = platform.pixelSize.width / platform.pixelSize.height;
  const imageRatio = canvas.width / canvas.height;

  // 최소 스케일 계산 (프레임을 완전히 덮는 최소 크기)
  const calculateMinScale = useCallback(() => {
    if (frameSize.width === 0 || frameSize.height === 0) return 1;

    const scaleToFitWidth = frameSize.width / canvas.width;
    const scaleToFitHeight = frameSize.height / canvas.height;

    return Math.max(scaleToFitWidth, scaleToFitHeight);
  }, [frameSize, canvas]);

  // 초기화: 프레임 크기 및 초기 위치 설정
  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = Math.min(400, window.innerHeight * 0.5);

    setContainerSize({ width: containerWidth, height: containerHeight });

    // 프레임 크기 계산 (컨테이너 안에 맞춤, 여백 포함)
    const padding = 40;
    const maxFrameWidth = containerWidth - padding * 2;
    const maxFrameHeight = containerHeight - padding * 2;

    let frameWidth, frameHeight;
    if (maxFrameWidth / maxFrameHeight > targetRatio) {
      frameHeight = maxFrameHeight;
      frameWidth = frameHeight * targetRatio;
    } else {
      frameWidth = maxFrameWidth;
      frameHeight = frameWidth / targetRatio;
    }

    setFrameSize({ width: frameWidth, height: frameHeight });

    // 초기 스케일 및 위치 설정
    const minScale = Math.max(
      frameWidth / canvas.width,
      frameHeight / canvas.height
    );

    // 초기 스케일은 최소 스케일의 1.1배 (여유 공간)
    const initialScale = minScale * 1.1;

    // 중앙 정렬
    const scaledWidth = canvas.width * initialScale;
    const scaledHeight = canvas.height * initialScale;
    const initialOffsetX = (frameWidth - scaledWidth) / 2;
    const initialOffsetY = (frameHeight - scaledHeight) / 2;

    setState({
      scale: initialScale,
      offsetX: initialOffsetX,
      offsetY: initialOffsetY,
    });
  }, [canvas, targetRatio]);

  // 경계 제한 적용
  const clampState = useCallback((newState: EditorState): EditorState => {
    const minScale = calculateMinScale();
    const clampedScale = Math.max(minScale, Math.min(2, newState.scale));

    const scaledWidth = canvas.width * clampedScale;
    const scaledHeight = canvas.height * clampedScale;

    // 오프셋 제한 (이미지가 프레임 밖으로 나가지 않도록)
    const minOffsetX = frameSize.width - scaledWidth;
    const maxOffsetX = 0;
    const minOffsetY = frameSize.height - scaledHeight;
    const maxOffsetY = 0;

    return {
      scale: clampedScale,
      offsetX: Math.min(maxOffsetX, Math.max(minOffsetX, newState.offsetX)),
      offsetY: Math.min(maxOffsetY, Math.max(minOffsetY, newState.offsetY)),
    };
  }, [canvas, frameSize, calculateMinScale]);

  // Canvas 그리기
  useEffect(() => {
    if (!canvasRef.current || frameSize.width === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = containerSize.width;
    canvasRef.current.height = containerSize.height;

    // 배경 (어두운 마스크)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, containerSize.width, containerSize.height);

    // 프레임 위치 계산 (중앙)
    const frameX = (containerSize.width - frameSize.width) / 2;
    const frameY = (containerSize.height - frameSize.height) / 2;

    // 클리핑 영역 설정 (프레임 내부만 이미지 표시)
    ctx.save();
    ctx.beginPath();
    ctx.rect(frameX, frameY, frameSize.width, frameSize.height);
    ctx.clip();

    // 이미지 그리기
    const scaledWidth = canvas.width * state.scale;
    const scaledHeight = canvas.height * state.scale;
    const imageX = frameX + state.offsetX;
    const imageY = frameY + state.offsetY;

    ctx.drawImage(canvas, imageX, imageY, scaledWidth, scaledHeight);
    ctx.restore();

    // 프레임 테두리
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.strokeRect(frameX, frameY, frameSize.width, frameSize.height);

    // 코너 핸들 (시각적)
    const cornerSize = 16;
    ctx.fillStyle = '#3B82F6';

    // 좌상단
    ctx.fillRect(frameX - 2, frameY - 2, cornerSize, 4);
    ctx.fillRect(frameX - 2, frameY - 2, 4, cornerSize);
    // 우상단
    ctx.fillRect(frameX + frameSize.width - cornerSize + 2, frameY - 2, cornerSize, 4);
    ctx.fillRect(frameX + frameSize.width - 2, frameY - 2, 4, cornerSize);
    // 좌하단
    ctx.fillRect(frameX - 2, frameY + frameSize.height - 2, cornerSize, 4);
    ctx.fillRect(frameX - 2, frameY + frameSize.height - cornerSize + 2, 4, cornerSize);
    // 우하단
    ctx.fillRect(frameX + frameSize.width - cornerSize + 2, frameY + frameSize.height - 2, cornerSize, 4);
    ctx.fillRect(frameX + frameSize.width - 2, frameY + frameSize.height - cornerSize + 2, 4, cornerSize);

    // 가이드 라인 (3분할)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // 세로선
    ctx.beginPath();
    ctx.moveTo(frameX + frameSize.width / 3, frameY);
    ctx.lineTo(frameX + frameSize.width / 3, frameY + frameSize.height);
    ctx.moveTo(frameX + (frameSize.width * 2) / 3, frameY);
    ctx.lineTo(frameX + (frameSize.width * 2) / 3, frameY + frameSize.height);
    ctx.stroke();

    // 가로선
    ctx.beginPath();
    ctx.moveTo(frameX, frameY + frameSize.height / 3);
    ctx.lineTo(frameX + frameSize.width, frameY + frameSize.height / 3);
    ctx.moveTo(frameX, frameY + (frameSize.height * 2) / 3);
    ctx.lineTo(frameX + frameSize.width, frameY + (frameSize.height * 2) / 3);
    ctx.stroke();

    ctx.setLineDash([]);
  }, [canvas, state, frameSize, containerSize]);

  // 터치/마우스 이벤트 핸들러
  const getEventPosition = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const getTouchDistance = (e: React.TouchEvent) => {
    if (e.touches.length < 2) return 0;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();

    if ('touches' in e && e.touches.length === 2) {
      // 핀치 시작
      setLastPinchDistance(getTouchDistance(e));
    } else {
      // 드래그 시작
      const pos = getEventPosition(e);
      setLastTouch(pos);
      setIsDragging(true);
    }
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();

    if ('touches' in e && e.touches.length === 2) {
      // 핀치 줌
      const distance = getTouchDistance(e);
      if (lastPinchDistance > 0) {
        const scaleChange = distance / lastPinchDistance;
        setState(prev => clampState({
          ...prev,
          scale: prev.scale * scaleChange,
        }));
      }
      setLastPinchDistance(distance);
    } else if (isDragging) {
      // 드래그
      const pos = getEventPosition(e);
      const deltaX = pos.x - lastTouch.x;
      const deltaY = pos.y - lastTouch.y;

      setState(prev => clampState({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY,
      }));

      setLastTouch(pos);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setLastPinchDistance(0);
  };

  // 슬라이더로 줌 조절
  const handleZoomChange = (value: number) => {
    const minScale = calculateMinScale();
    const newScale = minScale + (2 - minScale) * (value / 100);

    // 중앙 기준 줌
    const centerX = frameSize.width / 2;
    const centerY = frameSize.height / 2;

    const currentCenterX = -state.offsetX + centerX;
    const currentCenterY = -state.offsetY + centerY;

    const scaleFactor = newScale / state.scale;
    const newCenterX = currentCenterX * scaleFactor;
    const newCenterY = currentCenterY * scaleFactor;

    setState(prev => clampState({
      scale: newScale,
      offsetX: centerX - newCenterX,
      offsetY: centerY - newCenterY,
    }));
  };

  // 현재 줌 레벨 (슬라이더용)
  const minScale = calculateMinScale();
  const zoomLevel = minScale > 0 ? ((state.scale - minScale) / (2 - minScale)) * 100 : 50;

  // 최종 크롭 영역 계산
  const handleConfirm = () => {
    const cropArea: CropArea = {
      cropX: -state.offsetX / state.scale,
      cropY: -state.offsetY / state.scale,
      cropWidth: frameSize.width / state.scale,
      cropHeight: frameSize.height / state.scale,
    };
    onConfirm(cropArea);
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        🖼️ 위치 직접 조정
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        파란색 프레임 안에 얼굴이 오도록 사진을 드래그하세요
      </p>

      {/* 에디터 영역 */}
      <div
        ref={containerRef}
        className="relative bg-black rounded-xl overflow-hidden mb-4 touch-none"
        style={{ height: Math.min(400, typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400) }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-move"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* 안내 텍스트 오버레이 */}
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">
            드래그하여 이동 · 두 손가락으로 확대/축소
          </span>
        </div>
      </div>

      {/* 줌 슬라이더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">🔍</span>
          <input
            type="range"
            min="0"
            max="100"
            value={zoomLevel}
            onChange={(e) => handleZoomChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-sm text-gray-500 w-12 text-right">
            {Math.round(state.scale * 100)}%
          </span>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          슬라이더로 확대/축소할 수 있습니다
        </p>
      </div>

      {/* 규격 정보 */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-500">
          {platform.displayName} 규격:{' '}
          <span className="font-medium text-gray-700">
            {platform.pixelSize.width} × {platform.pixelSize.height}px
          </span>
          {' '}({platform.physicalSize.width}cm × {platform.physicalSize.height}cm)
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          ← 취소
        </Button>
        <Button
          onClick={handleConfirm}
          className="flex-1"
        >
          이 위치로 저장 →
        </Button>
      </div>
    </Card>
  );
}
