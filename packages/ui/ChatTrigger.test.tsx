import { render, screen, fireEvent } from '@testing-library/react';
import { ChatTrigger } from './ChatTrigger';

// Mock the Button component
jest.mock('./Button', () => {
  return {
    Button: ({ onClick, children, className, 'aria-label': ariaLabel }: any) => (
      <button onClick={onClick} className={className} aria-label={ariaLabel} data-testid="chat-trigger-button">
        {children}
      </button>
    ),
  };
});

describe('ChatTrigger', () => {
  beforeEach(() => {
    // Reset window object before each test
    // @ts-ignore
    delete window.Tawk_API;
  });

  it('does not render when Tawk_API is not available', () => {
    render(<ChatTrigger />);
    
    expect(screen.queryByTestId('chat-trigger-button')).not.toBeInTheDocument();
  });

  it('renders when Tawk_API is available', () => {
    // @ts-ignore
    window.Tawk_API = {};
    
    render(<ChatTrigger />);
    
    expect(screen.getByTestId('chat-trigger-button')).toBeInTheDocument();
    expect(screen.getByText('Chat with us')).toBeInTheDocument();
  });

  it('calls Tawk_API.maximize when clicked', () => {
    // @ts-ignore
    window.Tawk_API = {
      maximize: jest.fn(),
    };
    
    render(<ChatTrigger />);
    
    const button = screen.getByTestId('chat-trigger-button');
    fireEvent.click(button);
    
    expect(window.Tawk_API.maximize).toHaveBeenCalled();
  });

  it('does not crash when Tawk_API is available but maximize is not a function', () => {
    // @ts-ignore
    window.Tawk_API = {};
    
    render(<ChatTrigger />);
    
    const button = screen.getByTestId('chat-trigger-button');
    expect(() => fireEvent.click(button)).not.toThrow();
  });
});