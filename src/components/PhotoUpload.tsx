import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { extractMainColorFromImage, isColorMatch } from "../utils/colorExtractor";

interface PhotoUploadProps {
  colorCode: string;
  onUpload: (file: File) => void;
  onCancel: () => void;
}

type AnalysisStatus = "idle" | "analyzing" | "success" | "failed";

export function PhotoUpload({
  colorCode,
  onUpload,
  onCancel,
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisStatus, setAnalysisStatus] =
    useState<AnalysisStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [detectedColor, setDetectedColor] = useState<string | null>(null);
  const [isValidColor, setIsValidColor] = useState<boolean | null>(null);

  // 목표 색상 범위 (게이지의 노란색 점선 구간) - 더 관대한 기준
  const targetMin = 30; // 30%
  const targetMax = 90; // 90%

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      // 색상 분석 시작
      analyzeColor(previewUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzeColor = async (imageUrl: string) => {
    setAnalysisStatus("analyzing");
    setProgress(0);

    try {
      // 색상 추출
      const mainColor = await extractMainColorFromImage(imageUrl);
      setDetectedColor(mainColor);

      // 색상 유사도 계산 (0-1)
      const similarity = calculateSimilarity(mainColor, colorCode);
      const progressValue = similarity * 100;

      // 진행 바 애니메이션 (유사도까지)
      const targetProgress = Math.min(progressValue, 100);
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= targetProgress) {
            clearInterval(progressInterval);
            return targetProgress;
          }
          return prev + 2;
        });
      }, 30);

      // 애니메이션 완료 후 결과 확인
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(targetProgress);

        // 색상 매칭 검증 (더 관대한 tolerance 사용)
        const isValid = isColorMatch(mainColor, colorCode, 60); // tolerance를 60으로 증가
        setIsValidColor(isValid);

        // 목표 구간 내에 있거나 유사도가 충분하면 통과 (더 관대한 기준)
        // 유사도가 30% 이상이면 통과하거나, tolerance 내에 있으면 통과
        if ((progressValue >= targetMin || isValid) && progressValue >= 25) {
          setAnalysisStatus("success");
          // 자동 업로드 제거 - 사용자가 버튼을 눌러야 업로드됨
        } else {
          setAnalysisStatus("failed");
        }
      }, (targetProgress / 2) * 30 + 500);
    } catch (error) {
      console.error("Color extraction failed:", error);
      setAnalysisStatus("failed");
      setIsValidColor(false);
    }
  };

  // 색상 유사도 계산 (0-1)
  const calculateSimilarity = (color1: string, color2: string): number => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return 0;

    const diff =
      Math.abs(rgb1.r - rgb2.r) +
      Math.abs(rgb1.g - rgb2.g) +
      Math.abs(rgb1.b - rgb2.b);
    const maxDiff = 255 * 3;
    return 1 - diff / maxDiff;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl"
        style={{
          background: "linear-gradient(to bottom, #e0f2fe, #fef3c7, #fce7f3)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">사진 업로드</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 사진 업로드 영역 */}
        {!preview && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              사진을 업로드해주세요
            </p>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  사진을 선택하세요
                </p>
                <p className="text-xs text-gray-500">JPG, PNG 파일 지원</p>
              </div>
            </label>
          </div>
        )}

            {/* 이미지 미리보기 */}
            {preview && (
              <div className="mb-6">
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-4" style={{ border: `2px solid ${colorCode}` }}>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 목표 색상 및 감지된 색상 표시 */}
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm border-2 border-gray-300"
                      style={{ backgroundColor: colorCode }}
                    />
                    <div>
                      <div className="text-xs text-gray-500">목표 색상</div>
                      <div className="text-sm font-mono font-medium text-gray-900">{colorCode}</div>
                    </div>
                  </div>
                  {detectedColor && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm border-2 border-gray-300"
                        style={{ backgroundColor: detectedColor }}
                      />
                      <div>
                        <div className="text-xs text-gray-500">감지된 색상</div>
                        <div className="text-sm font-mono font-medium text-gray-900">{detectedColor}</div>
                      </div>
                    </div>
                  )}
                </div>

            {/* 진행 바 */}
            <div className="mb-4">
              <div className="relative">
                {/* 질문 아이콘 */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-600">?</span>
                  </div>
                </div>

                {/* 진행 바 컨테이너 */}
                <div className="relative h-8 bg-white rounded-full border-2 border-gray-300 overflow-hidden">
                  {/* 목표 구간 표시 (노란색 점선) */}
                  <div
                    className="absolute top-0 bottom-0 border-l-2 border-r-2 border-dashed border-yellow-400"
                    style={{
                      left: `${targetMin}%`,
                      width: `${targetMax - targetMin}%`,
                    }}
                  ></div>

                  {/* 진행 바 (목표 색상에서 흰색 그라데이션) */}
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(to right, ${colorCode}, ${colorCode}dd, ${colorCode}aa, ${colorCode}77, ${colorCode}44, #ffffff)`,
                    }}
                  ></div>
                </div>
              </div>

              {/* 상태 메시지 */}
              <div className="mt-3 text-center">
                {analysisStatus === "analyzing" && (
                  <>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      평균 색깔을 분석하고 있어요!
                    </p>
                    <p className="text-xs text-gray-500">
                      게이지가 점선 안의 구간에 도달하면 해당 사진을 업로드할
                      수 있어요!
                    </p>
                  </>
                )}
                {analysisStatus === "success" && (
                  <>
                    <p className="text-sm font-bold text-green-600 mb-1">
                      성공!
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      색상이 일치합니다. 사진을 업로드할 수 있어요
                    </p>
                    <button
                      onClick={() => {
                        if (selectedFile) {
                          onUpload(selectedFile);
                        }
                      }}
                      className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-colors shadow-md"
                    >
                      사진 업로드
                    </button>
                  </>
                )}
                {analysisStatus === "failed" && (
                  <>
                    <p className="text-sm font-bold text-red-600 mb-1">
                      실패!
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      다시 색을 찾아보아요
                    </p>
                    <button
                      onClick={() => {
                        setPreview(null);
                        setSelectedFile(null);
                        setAnalysisStatus("idle");
                        setProgress(0);
                        setDetectedColor(null);
                        setIsValidColor(null);
                      }}
                      className="mt-3 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      다시 선택
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
