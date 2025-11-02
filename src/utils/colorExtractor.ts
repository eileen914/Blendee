// 이미지에서 그리드 기반 컬러 추출
export async function extractColorsFromImage(
  imageUrl: string,
  gridSize: number = 49 // 7x7 그리드
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // 이미지 크기에 맞게 canvas 설정
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 이미지 그리기
      ctx.drawImage(img, 0, 0);
      
      // 그리드 크기 계산 (예: 7x7)
      const gridCols = Math.ceil(Math.sqrt(gridSize));
      const gridRows = Math.ceil(Math.sqrt(gridSize));
      const cellWidth = img.width / gridCols;
      const cellHeight = img.height / gridRows;
      
      const colors: string[] = [];
      
      // 각 그리드 셀의 평균 색상 계산
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const x = col * cellWidth;
          const y = row * cellHeight;
          
          // 셀 영역의 픽셀 데이터 추출 (샘플링)
          const imageData = ctx.getImageData(x, y, cellWidth, cellHeight);
          const data = imageData.data;
          
          // 평균 RGB 값 계산
          let r = 0, g = 0, b = 0;
          const pixelCount = data.length / 4;
          
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }
          
          r = Math.round(r / pixelCount);
          g = Math.round(g / pixelCount);
          b = Math.round(b / pixelCount);
          
          // Hex 코드로 변환
          colors.push(rgbToHex(r, g, b));
        }
      }
      
      resolve(colors);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
export function getColorName(colorCode: string): string {
  // 간단한 컬러 이름 매핑
  const colorMap: {
    [key: string]: string;
  } = {
    '#FF': '빨강',
    '#00': '파랑',
    '#0F': '초록',
    '#FF00': '노랑',
    '#FF0': '주황',
    '#F0F': '보라'
  };
  for (const [key, name] of Object.entries(colorMap)) {
    if (colorCode.toUpperCase().includes(key)) {
      return name;
    }
  }
  return '컬러';
}

/**
 * 참여자에게 랜덤한 컬러 블록(3~5개) 배정
 */
export function assignRandomColors(
  availableColors: string[],
  minColors: number = 3,
  maxColors: number = 5
): string[] {
  const numColors = Math.floor(Math.random() * (maxColors - minColors + 1)) + minColors;
  const shuffled = [...availableColors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numColors);
}

/**
 * 업로드한 사진에서 주요 색상 추출
 */
export async function extractMainColorFromImage(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // 전체 이미지의 평균 색상 계산
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      const pixelCount = data.length / 4;
      
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      
      r = Math.round(r / pixelCount);
      g = Math.round(g / pixelCount);
      b = Math.round(b / pixelCount);
      
      resolve(rgbToHex(r, g, b));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * 두 색상의 차이를 계산 (RGB 차이의 절대값 평균)
 */
function calculateColorDifference(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 255; // 매우 큰 차이
  
  const diff = (Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b)) / 3;
  return diff;
}

/**
 * Hex를 RGB로 변환
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * 색상 일치도 검증 (±10% 허용 오차)
 * RGB 값의 최대 범위가 255이므로, 10%는 약 25.5입니다.
 */
export function isColorMatch(
  uploadedColor: string,
  targetColor: string,
  tolerance: number = 25 // ±10% ≈ 25 (255의 약 10%)
): boolean {
  const diff = calculateColorDifference(uploadedColor, targetColor);
  return diff <= tolerance;
}