import { render, screen } from '@testing-library/react';
import { TawkToChat } from './TawkToChat';

// Mock Next.js Script component
jest.mock('next/script', () => {
  return {
    __esModule: true,
    default: ({ src }: { src: string }) => <script data-testid="tawkto-script" src={src} />,
  };
});

describe('TawkToChat', () => {
  beforeEach(() => {
    // Reset window object before each test
    // @ts-ignore
    delete window.Tawk_API;
    // @ts-ignore
    delete window.Tawk_LoadStart;
  });

  it('renders the Tawk.to script with correct URL', () => {
    render(<TawkToChat propertyId="test-property-id" widgetId="test-widget-id" />);
    
    const script = screen.getByTestId('tawkto-script');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('src', 'https://embed.tawk.to/test-property-id/test-widget-id');
  });

  it('initializes Tawk_API and Tawk_LoadStart on mount', () => {
    render(<TawkToChat propertyId="test-property-id" widgetId="test-widget-id" />);
    
    // @ts-ignore
    expect(window.Tawk_API).toBeDefined();
    // @ts-ignore
    expect(window.Tawk_LoadStart).toBeInstanceOf(Date);
  });

  it('does not override existing Tawk_API', () => {
    // @ts-ignore
    window.Tawk_API = { existing: true };
    
    render(<TawkToChat propertyId="test-property-id" widgetId="test-widget-id" />);
    
    // @ts-ignore
    expect(window.Tawk_API).toBeDefined();
    // @ts-ignore
    expect(window.Tawk_API.existing).toBe(true);
  });
});