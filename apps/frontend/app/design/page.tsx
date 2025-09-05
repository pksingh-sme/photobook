'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@ui/Button';
import { useDesignStore } from '@/lib/store';
import { designApi } from '@/lib/api';
import { fabric } from 'fabric';

export default function DesignPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { design, currentPageIndex, addPage, removePage, setCurrentPage } = useDesignStore();

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Initialize Fabric.js canvas
      fabricCanvasRef.current = new fabric.Canvas('fabric-canvas', {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        selection: true,
      });

      // Set up canvas events
      fabricCanvasRef.current.on('object:modified', handleCanvasChange);
      fabricCanvasRef.current.on('object:added', handleCanvasChange);
      fabricCanvasRef.current.on('object:removed', handleCanvasChange);

      // Load the current page content
      loadPageContent();
    }

    // Listen for photo dropped event
    const handlePhotoDropped = (e: CustomEvent) => {
      const { photo } = e.detail;
      handleAddImage(photo.url);
    };

    window.addEventListener('photoDroppedOnDesigner', handlePhotoDropped as EventListener);

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
      window.removeEventListener('photoDroppedOnDesigner', handlePhotoDropped as EventListener);
    };
  }, []);

  useEffect(() => {
    // When currentPageIndex changes, load the new page content
    if (fabricCanvasRef.current) {
      loadPageContent();
    }
  }, [currentPageIndex]);

  const handleCanvasChange = () => {
    // This function will be called whenever the canvas changes
    // You can implement auto-save or other functionality here
  };

  const loadPageContent = () => {
    if (!fabricCanvasRef.current) return;
    
    // Clear the canvas
    fabricCanvasRef.current.clear();
    
    // Set background color
    fabricCanvasRef.current.setBackgroundColor('#ffffff', fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current));
    
    // Load elements for the current page
    const currentPage = design.pages[currentPageIndex];
    if (currentPage && currentPage.elements) {
      currentPage.elements.forEach(element => {
        if (element.type === 'image') {
          // Load image element
          fabric.Image.fromURL(element.src, (img) => {
            img.set({
              left: element.x,
              top: element.y,
              scaleX: element.scaleX,
              scaleY: element.scaleY,
              angle: element.rotation,
              id: element.id,
            });
            fabricCanvasRef.current?.add(img);
          });
        } else if (element.type === 'text') {
          // Load text element
          const text = new fabric.Text(element.text, {
            left: element.x,
            top: element.y,
            fontSize: element.fontSize,
            fill: element.fill,
            angle: element.rotation,
            id: element.id,
          });
          fabricCanvasRef.current?.add(text);
        } else if (element.type === 'shape') {
          // Load shape element (rectangle example)
          const rect = new fabric.Rect({
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            fill: element.fill || '#cccccc',
            stroke: element.stroke || '#000000',
            strokeWidth: element.strokeWidth || 1,
            angle: element.rotation,
            id: element.id,
          });
          fabricCanvasRef.current?.add(rect);
        }
      });
    }
    
    fabricCanvasRef.current.renderAll();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save current canvas state to the design store
      if (fabricCanvasRef.current) {
        const objects = fabricCanvasRef.current.getObjects();
        const elements = objects.map(obj => {
          if (obj.type === 'image') {
            return {
              id: obj.id || Math.random().toString(36).substr(2, 9),
              type: 'image',
              x: obj.left,
              y: obj.top,
              width: obj.width,
              height: obj.height,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              rotation: obj.angle,
              src: obj.getSrc(),
            };
          } else if (obj.type === 'text') {
            return {
              id: obj.id || Math.random().toString(36).substr(2, 9),
              type: 'text',
              x: obj.left,
              y: obj.top,
              text: (obj as fabric.Text).text,
              fontSize: obj.fontSize,
              fill: obj.fill,
              rotation: obj.angle,
            };
          } else if (obj.type === 'rect') {
            return {
              id: obj.id || Math.random().toString(36).substr(2, 9),
              type: 'shape',
              x: obj.left,
              y: obj.top,
              width: obj.width,
              height: obj.height,
              fill: obj.fill,
              stroke: obj.stroke,
              strokeWidth: obj.strokeWidth,
              rotation: obj.angle,
            };
          }
          return null;
        }).filter(Boolean);
        
        // Update the current page in the store
        useDesignStore.getState().updatePage(currentPageIndex, {
          ...design.pages[currentPageIndex],
          elements: elements as any,
        });
      }
      
      await designApi.createDesign(
        design.title || 'Untitled Design',
        'A custom photo book design',
        design,
        undefined, // thumbnail
        false // isPublic
      );
      alert('Design saved successfully!');
    } catch (error) {
      console.error('Failed to save design:', error);
      alert('Failed to save design. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = (imageUrl: string) => {
    if (!fabricCanvasRef.current) return;
    
    fabric.Image.fromURL(imageUrl, (img) => {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
        id: `image-${Date.now()}`,
      });
      fabricCanvasRef.current?.add(img);
      fabricCanvasRef.current?.setActiveObject(img);
    });
  };

  const handleAddText = () => {
    if (!fabricCanvasRef.current) return;
    
    const text = new fabric.Text('Double click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
      id: `text-${Date.now()}`,
    });
    
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
  };

  const handleAddShape = () => {
    if (!fabricCanvasRef.current) return;
    
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#cccccc',
      stroke: '#000000',
      strokeWidth: 1,
      id: `shape-${Date.now()}`,
    });
    
    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
  };

  const handleOrder = () => {
    // Implement order functionality
    console.log('Ordering design');
  };

  const handleUndo = () => {
    useDesignStore.getState().undo();
    // Reload the canvas content after undo
    setTimeout(() => {
      loadPageContent();
    }, 0);
  };

  const handleRedo = () => {
    useDesignStore.getState().redo();
    // Reload the canvas content after redo
    setTimeout(() => {
      loadPageContent();
    }, 0);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Photo Book Designer</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleUndo}>
              Undo
            </Button>
            <Button variant="outline" onClick={handleRedo}>
              Redo
            </Button>
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleOrder}>Order</Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="w-16 bg-gray-100 flex flex-col items-center py-4 space-y-6">
          <button 
            className={`p-2 rounded ${selectedTool === 'select' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setSelectedTool('select')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </button>
          <button 
            className={`p-2 rounded ${selectedTool === 'text' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => {
              setSelectedTool('text');
              handleAddText();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>
          <button 
            className={`p-2 rounded ${selectedTool === 'image' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setSelectedTool('image')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button 
            className={`p-2 rounded ${selectedTool === 'shape' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => {
              setSelectedTool('shape');
              handleAddShape();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 bg-gray-200 p-4 overflow-auto">
          <div 
            ref={canvasRef} 
            className="bg-white shadow-lg mx-auto relative"
            style={{ width: '800px', height: '600px' }}
          >
            <canvas 
              id="fabric-canvas" 
              width="800" 
              height="600" 
              className="border border-gray-300"
            />
          </div>
          
          {/* Page Navigation */}
          <div className="flex justify-center mt-4 space-x-2">
            {design.pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-8 h-8 rounded-full ${
                  currentPageIndex === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={addPage}
              className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Properties</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Book Type</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={design.settings.bookType}
                onChange={(e) => useDesignStore.getState().updateDesignSettings({ bookType: e.target.value as any })}
              >
                <option value="softcover">Softcover</option>
                <option value="hardcover">Hardcover</option>
                <option value="layflat">Layflat</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={design.settings.size}
                onChange={(e) => useDesignStore.getState().updateDesignSettings({ size: e.target.value as any })}
              >
                <option value="A4">A4</option>
                <option value="A5">A5</option>
                <option value="square">Square</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Pages</label>
              <input 
                type="number" 
                min="20" 
                max="100" 
                value={design.settings.pageCount}
                onChange={(e) => useDesignStore.getState().updateDesignSettings({ pageCount: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Paper Type</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={design.settings.paperType}
                onChange={(e) => useDesignStore.getState().updateDesignSettings({ paperType: e.target.value as any })}
              >
                <option value="glossy">Glossy</option>
                <option value="matte">Matte</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-2">Preview</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Cover</span>
                  <span className="text-sm text-gray-500">{design.settings.size}</span>
                </div>
                <div className="bg-white rounded border border-gray-300 h-32 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Cover Preview</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Pages</span>
                  <span className="text-sm text-gray-500">{design.pages.length} pages</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {design.pages.slice(0, 8).map((page, index) => (
                    <div key={index} className="bg-white rounded border border-gray-300 aspect-square flex items-center justify-center">
                      <span className="text-gray-500 text-xs">{index + 1}</span>
                    </div>
                  ))}
                  {design.pages.length > 8 && (
                    <div className="bg-gray-100 rounded border border-gray-300 aspect-square flex items-center justify-center">
                      <span className="text-gray-500 text-xs">+{design.pages.length - 8}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}