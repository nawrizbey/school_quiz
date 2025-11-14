'use client';

import { useState, useRef, DragEvent } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  label = '📷 Súwret júklew',
  maxSizeMB = 5
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
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

      setPreviewUrl(publicUrl);
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

  const handleRemove = () => {
    setPreviewUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">
        {label}
      </label>

      {/* Preview */}
      {previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs max-h-40 rounded-lg border shadow-sm"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              setError('Súwretti júklewde qátelik');
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all"
            title="Óshiriw"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!previewUrl && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
            dragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploading ? (
            <div className="text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
              <p className="text-sm">Júklenbekte...</p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">📸</div>
              <p className="text-sm text-gray-600 mb-1">
                Súwretti sudırap keltiriń yamasa basıń
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP (maks {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {/* URL Input (optional) */}
      <details className="text-xs text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700">
          Yamasa URL júkleń
        </summary>
        <input
          type="url"
          value={previewUrl}
          onChange={(e) => {
            setPreviewUrl(e.target.value);
            onImageUploaded(e.target.value);
          }}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 text-sm"
          placeholder="https://example.com/image.jpg"
        />
      </details>
    </div>
  );
}
