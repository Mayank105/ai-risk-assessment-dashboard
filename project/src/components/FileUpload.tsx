import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { SecurityData } from '../types';
import { parseFile } from '../utils/fileParser';

interface FileUploadProps {
  onDataLoaded: (data: SecurityData[]) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseFile(file);
      onDataLoaded(data);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the format and try again.');
    }
  }, [onDataLoaded]);

  return (
    <div className="w-full max-w-md">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50/80 backdrop-blur-sm hover:bg-gray-100/80 transition-all duration-300"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-12 h-12 mb-3 text-blue-600 animate-bounce" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: CSV, JSON, YAML
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".csv,.json,.yaml,.yml"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}