'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@ui/Button';
import { photoApi } from '@/lib/api';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [draggedPhoto, setDraggedPhoto] = useState<any>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const data = await photoApi.getPhotos();
      setPhotos(data);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        await photoApi.uploadPhoto(files[i]);
      }
      fetchPhotos(); // Refresh the photo list
    } catch (error) {
      console.error('Failed to upload photos:', error);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset the file input
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await photoApi.deletePhoto(id);
      setPhotos(photos.filter(photo => photo.id !== id));
      setSelectedPhotos(selectedPhotos.filter(photoId => photoId !== id));
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  };

  const handleSelectPhoto = (id: string) => {
    setSelectedPhotos(prev => 
      prev.includes(id) 
        ? prev.filter(photoId => photoId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map(photo => photo.id));
    }
  };

  const handleDragStart = (e: React.DragEvent, photo: any) => {
    setDraggedPhoto(photo);
    e.dataTransfer.setData('text/plain', photo.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropOnDesigner = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPhoto) {
      // Send a custom event to notify the designer
      window.dispatchEvent(new CustomEvent('photoDroppedOnDesigner', {
        detail: { photo: draggedPhoto }
      }));
    }
    setDraggedPhoto(null);
  };

  const handleEditPhoto = (photo: any) => {
    // Implement photo editing functionality
    console.log('Editing photo:', photo);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Photos</h1>
          <div className="flex items-center space-x-4">
            {selectedPhotos.length > 0 && (
              <div 
                className="border-2 border-dashed border-blue-500 rounded-lg p-4 bg-blue-50 flex items-center justify-center"
                onDragOver={handleDragOver}
                onDrop={handleDropOnDesigner}
              >
                <p className="text-blue-700 font-medium">Drop to add to current design</p>
              </div>
            )}
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleUpload}
                accept="image/*"
                multiple
              />
              <label htmlFor="file-upload">
                <Button as="span" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Photos'}
                </Button>
              </label>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedPhotos.length === photos.length && photos.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                  Select all
                </label>
                {selectedPhotos.length > 0 && (
                  <span className="ml-4 text-sm text-gray-500">
                    {selectedPhotos.length} selected
                  </span>
                )}
              </div>
              {selectedPhotos.length > 0 && (
                <Button variant="outline" onClick={() => {
                  setSelectedPhotos([]);
                }}>
                  Clear Selection
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div 
                  key={photo.id} 
                  className={`bg-white rounded-lg shadow overflow-hidden transition-all duration-200 ${
                    selectedPhotos.includes(photo.id) 
                      ? 'ring-2 ring-blue-500 transform scale-105' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <div 
                    className="relative"
                    draggable
                    onDragStart={(e) => handleDragStart(e, photo)}
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.name} 
                      className="w-full h-48 object-cover cursor-move"
                    />
                    <input
                      type="checkbox"
                      checked={selectedPhotos.includes(photo.id)}
                      onChange={() => handleSelectPhoto(photo.id)}
                      className="absolute top-2 left-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{photo.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(photo.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleEditPhoto(photo)}>Edit</Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Send a custom event to notify the designer
                          window.dispatchEvent(new CustomEvent('photoDroppedOnDesigner', {
                            detail: { photo }
                          }));
                        }}
                      >
                        Add to Book
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {photos.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No photos</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading a new photo.</p>
                <div className="mt-6">
                  <label htmlFor="file-upload-empty" className="cursor-pointer">
                    <Button as="span">Upload Photo</Button>
                    <input
                      type="file"
                      id="file-upload-empty"
                      className="hidden"
                      onChange={handleUpload}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}