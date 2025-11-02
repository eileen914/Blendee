import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { extractMainColorFromImage, isColorMatch } from '../utils/colorExtractor';

interface PhotoUploadProps {
  colorCode: string;
  onUpload: (file: File) => void;
  onCancel: () => void;
}

export function PhotoUpload({
  colorCode,
  onUpload,
  onCancel
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidColor, setIsValidColor] = useState<boolean | null>(null);
  const [detectedColor, setDetectedColor] = useState<string | null>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        
        // 색상 검증 시작
        setIsValidating(true);
        try {
          const mainColor = await extractMainColorFromImage(previewUrl);
          setDetectedColor(mainColor);
          const isValid = isColorMatch(mainColor, colorCode);
          setIsValidColor(isValid);
        } catch (error) {
          console.error('Color extraction failed:', error);
          setIsValidColor(false);
        } finally {
          setIsValidating(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">사진 업로드</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg shadow-sm" style={{
            backgroundColor: colorCode
          }} />
            <div>
              <div className="text-sm font-medium text-gray-900">목표 컬러</div>
              <div className="text-xs text-gray-500">{colorCode}</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            이 컬러가 포함된 사진을 업로드해주세요
          </p>
        </div>

        {!preview ? <label className="block">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                사진을 선택하세요
              </p>
              <p className="text-xs text-gray-500">JPG, PNG 파일 지원</p>
            </div>
          </label> : <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
            </div>
            
            {/* 색상 검증 결과 */}
            {isValidating && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>색상 분석 중...</span>
              </div>
            )}
            
            {!isValidating && detectedColor && (
              <div className={`p-3 rounded-lg border-2 ${
                isValidColor 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isValidColor ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        색상 매칭 성공! ✓
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700">
                        색상이 일치하지 않습니다
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>감지된 색상:</span>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: detectedColor }} />
                    <span className="font-mono">{detectedColor}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button onClick={() => {
                setPreview(null);
                setSelectedFile(null);
                setIsValidColor(null);
                setDetectedColor(null);
              }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                다시 선택
              </button>
              <button 
                onClick={handleUpload} 
                disabled={!isValidColor}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isValidColor
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                업로드
              </button>
            </div>
          </div>}
      </div>
    </div>;
}