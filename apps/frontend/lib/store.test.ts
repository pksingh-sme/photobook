import { useDesignStore } from './store';

// Mock localStorage for testing
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

describe('useDesignStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useDesignStore.setState({
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
    });
  });

  it('should initialize with default state', () => {
    const state = useDesignStore.getState();
    expect(state.design.pages).toHaveLength(1);
    expect(state.currentPageIndex).toBe(0);
    expect(state.history).toEqual([]);
    expect(state.historyIndex).toBe(-1);
  });

  it('should add a new page', () => {
    const initialState = useDesignStore.getState();
    useDesignStore.getState().addPage();
    const newState = useDesignStore.getState();
    
    expect(newState.design.pages).toHaveLength(2);
    expect(newState.design.pages[1].id).toBe('page-2');
    expect(newState.design.pages[1].elements).toEqual([]);
  });

  it('should remove a page', () => {
    // Add a second page first
    useDesignStore.getState().addPage();
    const initialState = useDesignStore.getState();
    
    expect(initialState.design.pages).toHaveLength(2);
    
    // Remove the second page
    useDesignStore.getState().removePage(1);
    const newState = useDesignStore.getState();
    
    expect(newState.design.pages).toHaveLength(1);
    expect(newState.currentPageIndex).toBe(0);
  });

  it('should not remove the last page', () => {
    const initialState = useDesignStore.getState();
    expect(initialState.design.pages).toHaveLength(1);
    
    // Try to remove the only page
    useDesignStore.getState().removePage(0);
    const newState = useDesignStore.getState();
    
    // Should still have one page
    expect(newState.design.pages).toHaveLength(1);
  });

  it('should set current page', () => {
    // Add a second page first
    useDesignStore.getState().addPage();
    const initialState = useDesignStore.getState();
    
    expect(initialState.currentPageIndex).toBe(0);
    
    // Set current page to 1
    useDesignStore.getState().setCurrentPage(1);
    const newState = useDesignStore.getState();
    
    expect(newState.currentPageIndex).toBe(1);
  });

  it('should update page', () => {
    const updatedPage = {
      id: 'page-1',
      elements: [
        {
          id: 'element-1',
          type: 'image',
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          src: 'test-image.jpg',
        },
      ],
      width: 800,
      height: 600,
    };
    
    useDesignStore.getState().updatePage(0, updatedPage);
    const newState = useDesignStore.getState();
    
    expect(newState.design.pages[0]).toEqual(updatedPage);
  });

  it('should update design settings', () => {
    useDesignStore.getState().updateDesignSettings({
      bookType: 'hardcover',
      size: 'A5',
    });
    const newState = useDesignStore.getState();
    
    expect(newState.design.settings.bookType).toBe('hardcover');
    expect(newState.design.settings.size).toBe('A5');
    expect(newState.design.settings.pageCount).toBe(20); // Should remain unchanged
  });

  it('should add element to page', () => {
    const newElement = {
      id: 'element-1',
      type: 'text',
      x: 50,
      y: 50,
      text: 'Test text',
      fontSize: 16,
      fill: '#000000',
      rotation: 0,
    };
    
    useDesignStore.getState().addElementToPage(0, newElement);
    const newState = useDesignStore.getState();
    
    expect(newState.design.pages[0].elements).toHaveLength(1);
    expect(newState.design.pages[0].elements[0]).toEqual(newElement);
  });

  it('should update element in page', () => {
    // First add an element
    const initialElement = {
      id: 'element-1',
      type: 'text',
      x: 50,
      y: 50,
      text: 'Test text',
      fontSize: 16,
      fill: '#000000',
      rotation: 0,
    };
    
    useDesignStore.getState().addElementToPage(0, initialElement);
    
    // Then update it
    useDesignStore.getState().updateElementInPage(0, 'element-1', {
      text: 'Updated text',
      fontSize: 20,
    });
    
    const newState = useDesignStore.getState();
    
    expect(newState.design.pages[0].elements[0].text).toBe('Updated text');
    expect(newState.design.pages[0].elements[0].fontSize).toBe(20);
    expect(newState.design.pages[0].elements[0].x).toBe(50); // Should remain unchanged
  });

  it('should remove element from page', () => {
    // First add an element
    const element1 = {
      id: 'element-1',
      type: 'text',
      x: 50,
      y: 50,
      text: 'Test text 1',
      fontSize: 16,
      fill: '#000000',
      rotation: 0,
    };
    
    const element2 = {
      id: 'element-2',
      type: 'text',
      x: 100,
      y: 100,
      text: 'Test text 2',
      fontSize: 16,
      fill: '#000000',
      rotation: 0,
    };
    
    useDesignStore.getState().addElementToPage(0, element1);
    useDesignStore.getState().addElementToPage(0, element2);
    
    expect(useDesignStore.getState().design.pages[0].elements).toHaveLength(2);
    
    // Remove one element
    useDesignStore.getState().removeElementFromPage(0, 'element-1');
    
    const newState = useDesignStore.getState();
    
    expect(newState.design.pages[0].elements).toHaveLength(1);
    expect(newState.design.pages[0].elements[0].id).toBe('element-2');
  });

  it('should handle undo/redo functionality', () => {
    // Initial state
    const initialState = useDesignStore.getState();
    
    // Make a change
    useDesignStore.getState().updateDesignSettings({ bookType: 'hardcover' });
    const afterChange = useDesignStore.getState();
    
    expect(afterChange.design.settings.bookType).toBe('hardcover');
    
    // Undo the change
    useDesignStore.getState().undo();
    const afterUndo = useDesignStore.getState();
    
    expect(afterUndo.design.settings.bookType).toBe('softcover');
    
    // Redo the change
    useDesignStore.getState().redo();
    const afterRedo = useDesignStore.getState();
    
    expect(afterRedo.design.settings.bookType).toBe('hardcover');
  });
});