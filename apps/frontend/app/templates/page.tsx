'use client';

import { useState, useEffect } from 'react';
import { useDesignStore } from '@/lib/store';
import { designApi } from '@/lib/api';
import { Button } from '@ui/Button';
import { Modal } from '@ui/Modal';
import Link from 'next/link';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const { design, saveAsTemplate, loadTemplate, loadTemplates, deleteTemplate } = useDesignStore();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      // Load templates from the store (which may include both local and backend templates)
      const storeTemplates = useDesignStore.getState().getTemplates();
      
      // Also fetch templates from the backend
      const backendTemplates = await designApi.getDesigns();
      
      // Combine templates, prioritizing backend templates
      const allTemplates = [...storeTemplates, ...backendTemplates.filter((bt: any) => 
        !storeTemplates.some((st: any) => st.id === bt.id)
      )];
      
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      // Fallback to local templates only
      setTemplates(useDesignStore.getState().getTemplates());
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    try {
      setSaving(true);
      
      // Save to local store
      await saveAsTemplate(templateName, templateDescription);
      
      // Also save to backend
      await designApi.createDesign(
        templateName,
        templateDescription,
        design,
        undefined, // thumbnail
        true // isPublic - templates are public by default
      );
      
      // Refresh templates list
      await fetchTemplates();
      
      // Reset form and close modal
      setTemplateName('');
      setTemplateDescription('');
      setShowSaveModal(false);
      
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadTemplate = (template: any) => {
    loadTemplate(template);
    alert(`Template "${template.title || template.name}" loaded successfully!`);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      // Delete from local store
      await deleteTemplate(templateId);
      
      // Also delete from backend
      await designApi.deleteDesign(templateId);
      
      // Refresh templates list
      await fetchTemplates();
      
      alert('Template deleted successfully!');
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Design Templates</h1>
          <Button onClick={() => setShowSaveModal(true)}>
            Save Current Design as Template
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by saving your current design as a template.</p>
            <div className="mt-6">
              <Button onClick={() => setShowSaveModal(true)}>
                Save Current Design as Template
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{template.title || template.name}</h3>
                      {template.description && (
                        <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {template.createdAt ? formatDate(template.createdAt) : 'Recently saved'}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadTemplate(template)}
                      >
                        Load
                      </Button>
                      <Link href={`/design/${template.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Save Template Modal */}
        <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Save Design as Template
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">
                      Template Name
                    </label>
                    <input
                      type="text"
                      id="template-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <label htmlFor="template-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="template-description"
                      rows={3}
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter template description (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleSaveAsTemplate}
              disabled={saving || !templateName.trim()}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {saving ? 'Saving...' : 'Save Template'}
            </Button>
            <Button
              onClick={() => setShowSaveModal(false)}
              disabled={saving}
              variant="outline"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}