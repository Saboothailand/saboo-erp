import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // MB 단위
  label?: string;
  className?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUploadComplete,
  onUploadError,
  accept = 'image/*',
  maxSize = 5,
  label = '파일 선택',
  className = '',
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateFile = (file: File): string | null => {
    // 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      return `파일 크기는 ${maxSize}MB 이하여야 합니다.`;
    }

    // 파일 타입 검증
    if (accept.includes('image/*')) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return '지원되는 이미지 형식: JPEG, PNG, GIF, WebP';
      }
    }

    // 파일명 검증
    const fileName = file.name.toLowerCase();
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return '잘못된 파일명입니다.';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    setErrorMessage('');
    setUploadStatus('idle');

    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setUploadStatus('error');
      onUploadError?.(validationError);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'uploading':
        return <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'success':
        return '업로드 완료';
      case 'error':
        return '업로드 실패';
      case 'uploading':
        return '업로드 중...';
      default:
        return label;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : ''}
          ${uploadStatus === 'error' ? 'border-red-500 bg-red-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center space-y-2">
          {getStatusIcon()}
          
          <div className="text-sm">
            <p className="font-medium text-gray-900">{getStatusText()}</p>
            {selectedFile && (
              <p className="text-gray-500 mt-1">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
            {!selectedFile && (
              <p className="text-gray-500 mt-1">
                클릭하거나 파일을 드래그하여 업로드하세요
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
          )}
        </div>

        {selectedFile && (
          <button
            onClick={removeFile}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {selectedFile && (
        <div className="mt-2 text-xs text-gray-500">
          <p>파일 형식: {selectedFile.type}</p>
          <p>파일 크기: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 