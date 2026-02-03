/**
 * 이미지 처리 관련 타입 정의
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageData {
  canvas: HTMLCanvasElement;
  originalFile: File;
  originalDimensions: ImageDimensions;
  currentDimensions: ImageDimensions;
  format: 'jpg' | 'png';
  sizeBytes: number;
  orientation: number;
}

export interface AnalysisIssue {
  type: 'size' | 'width' | 'height' | 'ratio' | 'format';
  label: string;
  current: string | number;
  required: string | number;
  passed: boolean;
}

export interface AnalysisResult {
  passed: boolean;
  issues: AnalysisIssue[];
  score: number; // 0-100
}

export interface FixResult {
  original: ImageData;
  fixed: ImageData;
  changes: FixChange[];
}

export interface FixChange {
  type: 'resize' | 'compress' | 'crop' | 'format';
  description: string;
  before: string;
  after: string;
}

export interface ResizeResult {
  width: number;
  height: number;
  cropX: number;
  cropY: number;
  cropWidth?: number;
  cropHeight?: number;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'analyzing' | 'fixing' | 'done' | 'error';
