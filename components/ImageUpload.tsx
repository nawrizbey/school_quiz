'use client';

import { useState, useRef, DragEvent, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  placeholder?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  placeholder = 'Súwret URL yamasa júklew ushın 📷 basıń',
  maxSizeMB = 5
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageUrl(currentImageUrl || '');
    setUrlInput(currentImageUrl || '');
  }, [currentImageUrl]);

  const uploadImage = async (file: File) => {
    try {
      setError('');
      setUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Tek súwret faylları júklewge ruqsat');
        return;
      }

      // Validate file size
      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`Súwret ólshemi ${maxSizeMB}MB dan asırmaslıǵı kerek`);
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('quiz-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setError('Súwret júklewde qátelik júz berdi');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('quiz-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      setUrlInput(publicUrl);
      onImageUploaded(publicUrl);
    } catch (err) {
      console.error('Error:', err);
      setError('Qátelik júz berdi');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlInput(value);
    setImageUrl(value);
    onImageUploaded(value);
  };

  const handleRemove = () => {
    setImageUrl('');
    setUrlInput('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1">
      {/* Compact Input Field */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex items-center border rounded-lg transition-all ${
          dragging
            ? 'border-purple-500 bg-purple-50'
            : error
            ? 'border-red-300'
            : 'border-gray-300 hover:border-purple-400'
        } ${uploading ? 'opacity-50' : ''}`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Icon Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 text-gray-500 hover:text-purple-600 transition-colors flex-shrink-0"
          disabled={uploading}
          title="Súwret júklew"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
          ) : (
            <span className="text-xl">📷</span>
          )}
        </button>

        {/* URL Input */}
        <input
          type="text"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className="flex-1 px-2 py-2 bg-transparent focus:outline-none text-gray-800 text-sm"
          disabled={uploading}
        />

        {/* Thumbnail Preview */}
        {imageUrl && (
          <div className="flex items-center gap-2 pr-2">
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setShowPreview(true)}
              onMouseLeave={() => setShowPreview(false)}
            >
              <img
                src={imageUrl}
                alt="Preview"
                className="w-8 h-8 rounded object-cover border border-gray-200"
                onError={() => setError('Súwretti júklewde qátelik')}
              />
              {showPreview && (
                <div className="absolute right-0 top-10 z-10 p-2 bg-white rounded-lg shadow-xl border">
                  <img
                    src={imageUrl}
                    alt="Full Preview"
                    className="max-w-xs max-h-64 rounded"
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
              title="Óshiriw"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {/* Help Text */}
      {!error && !imageUrl && (
        <p className="text-xs text-gray-500">
          Súwretti sudırap keltiriń, 📷 basıń yamasa URL kirgiziń (maks {maxSizeMB}MB)
        </p>
      )}
    </div>
  );
}
