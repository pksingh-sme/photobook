import { create } from 'zustand';
import { PhotoBookDesign, CanvasPage, CanvasElement } from '@types/index';

interface DesignState {
  design: PhotoBookDesign;
  currentPageIndex: number;
  history: PhotoBookDesign[];
  historyIndex: number;
  templates: PhotoBookDesign[];
  addPage: () => void;
  removePage: (pageIndex: number) => void;
  setCurrentPage: (pageIndex: number) => void;
  updatePage: (pageIndex: number, page: CanvasPage) => void;
  updateDesignSettings: (settings: Partial<PhotoBookDesign['settings']>) => void;
  addElementToPage: (pageIndex: number, element: CanvasElement) => void;
  updateElementInPage: (pageIndex: number, elementId: string, updates: Partial<CanvasElement>) => void;
  removeElementFromPage: (pageIndex: number, elementId: string) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  // Template functions
  saveAsTemplate: (name: string, description: string) => Promise<void>;
  loadTemplate: (template: PhotoBookDesign) => void;
  loadTemplates: () => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
  getTemplates: () => PhotoBookDesign[];
}

export const useDesignStore = create<DesignState>((set, get) => ({
  design: {
    id: 'new-design',
    pages: [
      {
        id: 'page-1',
        elements: [],
        width: 800,
        height: 600,
      },
    ],
    title: 'My Photo Book',
    settings: {
      bookType: 'softcover',
      size: 'A4',
      pageCount: 20,
      paperType: 'glossy',
    },
  },
  currentPageIndex: 0,
  history: [],
  historyIndex: -1,
  templates: [],
  
  saveToHistory: () => set((state) => {
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(state.design))];
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }),
  
  undo: () => set((state) => {
    if (state.historyIndex <= 0) return state;
    
    const newIndex = state.historyIndex - 1;
    const newDesign = JSON.parse(JSON.stringify(state.history[newIndex]));
    
    return {
      design: newDesign,
      historyIndex: newIndex,
    };
  }),
  
  redo: () => set((state) => {
    if (state.historyIndex >= state.history.length - 1) return state;
    
    const newIndex = state.historyIndex + 1;
    const newDesign = JSON.parse(JSON.stringify(state.history[newIndex]));
    
    return {
      design: newDesign,
      historyIndex: newIndex,
    };
  }),
  
  addPage: () => set((state) => {
    const newPage: CanvasPage = {
      id: `page-${state.design.pages.length + 1}`,
      elements: [],
      width: 800,
      height: 600,
    };
    
    const newState = {
      design: {
        ...state.design,
        pages: [...state.design.pages, newPage],
      },
    };
    
    // Save to history
    setTimeout(() => {
      get().saveToHistory();
    }, 0);
    
    return newState;
  }),
  
  removePage: (pageIndex) => set((state) => {
    if (state.design.pages.length <= 1) return state;
    
    const newPages = [...state.design.pages];
    newPages.splice(pageIndex, 1);
    
    const newState = {
      design: {
        ...state.design,
        pages: newPages,
      },
      currentPageIndex: Math.min(state.currentPageIndex, newPages.length - 1),
    };
    
    // Save to history
    setTimeout(() => {
      get().saveToHistory();
    }, 0);
    
    return newState;
  }),
  
  setCurrentPage: (pageIndex) => set({ currentPageIndex: pageIndex }),
  
  updatePage: (pageIndex, page) => set((state) => {
    const newPages = [...state.design.pages];
    newPages[pageIndex] = page;
    
    const newState = {
      design: {
        ...state.design,
        pages: newPages,
      },
    };
    
    // Save to history
    setTimeout(() => {
      get().saveToHistory();
    }, 0);
    
    return newState;
  }),
  
  updateDesignSettings: (settings) => set((state) => {
    const newState = {
      design: {
        ...state.design,
        settings: {
          ...state.design.settings,
          ...settings,
        },
      },
    };
    
    // Save to history
    setTimeout(() => {
      get().saveToHistory();
    }, 0);
    
    return newState;
  }),
  
  addElementToPage: (pageIndex, element) => set((state) => {
    const newPages = [...state.design.pages];
    const page = newPages[pageIndex];
    
    if (page) {
      newPages[pageIndex] = {
        ...page,
        elements: [...page.elements, element],
      };
    }
    
    const newState = {
      design: {
        ...state.design,
        pages: newPages,
      },
    };
    
    // Save to history
    setTimeout(() => {
      get().saveToHistory();
    }, 0);
    
    return newState;
  }),
  
  updateElementInPage: (pageIndex, elementId, updates) => set((state) => {
    const newPages = [...state.design.pages];
    const page = newPages[pageIndex];
    
    if (page) {
      const elementIndex = page.elements.findIndex(e => e.id === elementId);
      if (elementIndex !== -1) {
        const updatedElements = [...page.elements];
        updatedElements[elementIndex] = {
          ...updatedElements[elementIndex],
          ...updates,
        };
        
        newPages[pageIndex] = {
          ...page,
          elements: updatedElements,
        };
      }
    }
    
    const newState = {
      design: {
        ...state.design,
        pages: newPages,
      },
    };
    
    // Save to history
    setTimeout(() => {
      get().saveToHistory();
    }, 0);
    
    return newState;
  }),
  
  removeElementFromPage: (pageIndex, elementId) => set((state) => {
    const newPages = [...state.design.pages];
    const page = newPages[pageIndex];
    
    if (page) {
      newPages[pageIndex] = {
        ...page,
        elements: page.elements.filter(e => e.id !== elementId),
      };
    }
    
    const newState = {
      design: {
        ...state.design,
        pages: newPages,
      },
    };
    
    // Save to history
    setTimeout(() => {
      get().saveToHistory();
    }, 0);
    
    return newState;
  }),
  
  // Template functions
  saveAsTemplate: async (name: string, description: string) => {
    // In a real implementation, this would save to the backend
    // For now, we'll just add it to the local templates
    const state = get();
    const template: PhotoBookDesign = {
      ...JSON.parse(JSON.stringify(state.design)),
      id: `template-${Date.now()}`,
      title: name,
      description: description,
    };
    
    set({
      templates: [...state.templates, template]
    });
    
    // In a real implementation, we would also save to the backend
    // await designApi.createDesign(name, description, state.design, '', true);
  },
  
  loadTemplate: (template: PhotoBookDesign) => {
    const newDesign = JSON.parse(JSON.stringify(template));
    newDesign.id = `design-${Date.now()}`;
    
    set({
      design: newDesign,
      currentPageIndex: 0,
      history: [],
      historyIndex: -1,
    });
    
    // Save to history
    setTimeout(() => {
      get().saveToHistory();
    }, 0);
  },
  
  loadTemplates: async () => {
    // In a real implementation, this would load from the backend
    // For now, we'll just return the local templates
    const state = get();
    return state.templates;
    
    // In a real implementation, we would do:
    // const templates = await designApi.getTemplates();
    // set({ templates });
  },
  
  deleteTemplate: async (templateId: string) => {
    const state = get();
    const newTemplates = state.templates.filter(template => template.id !== templateId);
    set({ templates: newTemplates });
    
    // In a real implementation, we would also delete from the backend
    // await designApi.deleteDesign(templateId);
  },
  
  getTemplates: () => {
    const state = get();
    return state.templates;
  },
}));