import React from 'react';
import { ColorAssignment as ColorAssignmentType } from '../types';
import { Clock, Palette } from 'lucide-react';

interface ColorAssignmentProps {
  assignment: ColorAssignmentType;
  completedColors: string[];
  onColorClick?: (colorCode: string) => void;
}

export function ColorAssignment({
  assignment,
  completedColors,
  onColorClick
}: ColorAssignmentProps) {
  const daysLeft = Math.ceil((assignment.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const completedCount = assignment.colorCodes.filter(c => completedColors.includes(c)).length;
  
  return <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">내 컬러 미션</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{daysLeft}일 남음</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">완료</span>
          <span className="font-medium text-gray-900">
            {completedCount} / {assignment.colorCodes.length}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all" style={{
          width: `${completedCount / assignment.colorCodes.length * 100}%`
        }} />
        </div>
      </div>

      <div className="space-y-2">
        {assignment.colorCodes.map((color, index) => {
        const isCompleted = completedColors.includes(color);
        return <div 
          key={index} 
          onClick={() => !isCompleted && onColorClick?.(color)}
          className={`
            flex items-center gap-3 p-3 rounded-lg border-2 transition-all
            ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100'}
          `}
        >
              <div className="w-10 h-10 rounded-lg shadow-sm flex-shrink-0" style={{
            backgroundColor: color
          }} />
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">{color}</div>
                <div className="text-xs text-gray-500">
                  {isCompleted ? '✓ 업로드 완료' : '클릭하여 사진 업로드'}
                </div>
              </div>
            </div>;
      })}
      </div>
    </div>;
}