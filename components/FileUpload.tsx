import React, { useState, useCallback } from 'react';
import { Icon } from './Icon';

interface FileUploadProps {
  onFileProcess: (content: string, fileName: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;

    setError(null);
    const validTypes = ['text/plain', 'text/markdown', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    // Basic type check - actual content reading for text is the main goal
    if (file.type && !file.type.startsWith('text/')) {
        console.warn(`Warning: File type is ${file.type}. Attempting to read as text.`);
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File is too large. Please upload files under 5MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onFileProcess(content, file.name);
      } else {
        setError("Could not read file content.");
      }
    };
    reader.onerror = () => {
        setError("Error reading the file.");
    };
    reader.readAsText(file);
  }, [onFileProcess]);

  // Fix: Corrected event type to match the HTMLLabelElement.
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Fix: Corrected event type to match the HTMLLabelElement.
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Fix: Corrected event type to match the HTMLLabelElement.
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Fix: Corrected event type to match the HTMLLabelElement.
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file || null);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <label
        htmlFor="file-upload"
        className={`w-full max-w-2xl p-8 sm:p-12 lg:p-16 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-100'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Icon name="upload" className="w-12 h-12 text-slate-400" />
          <p className="text-xl font-semibold text-slate-700">
            Drag & drop your notes here
          </p>
          <p className="text-slate-500">or click to browse files</p>
          <p className="text-xs text-slate-400">TXT, MD files supported. Max 5MB.</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".txt,.md"
          onChange={handleFileChange}
        />
      </label>
      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
    </div>
  );
};
