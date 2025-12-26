import { renderHook, act } from '@testing-library/react';
import { useResponsiveLogo, useNavLogo, useHeroLogo } from '../useResponsiveLogo';

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

beforeEach(() => {
  Object.defineProperty(window, 'addEventListener', {
    writable: true,
    configurable: true,
    value: mockAddEventListener,
  });
  
  Object.defineProperty(window, 'removeEventListener', {
    writable: true,
    configurable: true,
    value: mockRemoveEventListener,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useResponsiveLogo', () => {
  it('returns correct configuration for small screens', () => {
    mockInnerWidth(500);
    
    const { result } = renderHook(() => useResponsiveLogo());
    
    expect(result.current.screenSize).toBe('sm');
    expect(result.current.size).toBe('sm');
    expect(result.current.variant).toBe('icon');
  });

  it('returns correct configuration for medium screens', () => {
    mockInnerWidth(800);
    
    const { result } = renderHook(() => useResponsiveLogo());
    
    expect(result.current.screenSize).toBe('md');
    expect(result.current.size).toBe('md');
    expect(result.current.variant).toBe('primary');
  });

  it('returns correct configuration for large screens', () => {
    mockInnerWidth(1200);
    
    const { result } = renderHook(() => useResponsiveLogo());
    
    expect(result.current.screenSize).toBe('lg');
    expect(result.current.size).toBe('lg');
    expect(result.current.variant).toBe('primary');
  });

  it('returns correct configuration for extra large screens', () => {
    mockInnerWidth(1400);
    
    const { result } = renderHook(() => useResponsiveLogo());
    
    expect(result.current.screenSize).toBe('xl');
    expect(result.current.size).toBe('xl');
    expect(result.current.variant).toBe('primary');
  });

  it('adds and removes resize event listener', () => {
    const { unmount } = renderHook(() => useResponsiveLogo());
    
    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('updates screen size when window is resized', () => {
    mockInnerWidth(500);
    
    const { result } = renderHook(() => useResponsiveLogo());
    
    expect(result.current.screenSize).toBe('sm');
    
    // Simulate window resize
    mockInnerWidth(1200);
    
    act(() => {
      // Get the resize handler that was passed to addEventListener
      const resizeHandler = mockAddEventListener.mock.calls[0][1];
      resizeHandler();
    });
    
    expect(result.current.screenSize).toBe('lg');
  });
});

describe('useNavLogo', () => {
  it('returns navigation-optimized logo configuration', () => {
    mockInnerWidth(800);
    
    const { result } = renderHook(() => useNavLogo());
    
    expect(result.current.size).toBe('md');
    expect(result.current.variant).toBe('primary');
  });

  it('uses smaller size for mobile navigation', () => {
    mockInnerWidth(500);
    
    const { result } = renderHook(() => useNavLogo());
    
    expect(result.current.size).toBe('sm');
    expect(result.current.variant).toBe('primary');
  });
});

describe('useHeroLogo', () => {
  it('returns hero-optimized logo configuration', () => {
    mockInnerWidth(800);
    
    const { result } = renderHook(() => useHeroLogo());
    
    expect(result.current.size).toBe('xl');
    expect(result.current.variant).toBe('primary');
  });

  it('uses large size even for mobile hero', () => {
    mockInnerWidth(500);
    
    const { result } = renderHook(() => useHeroLogo());
    
    expect(result.current.size).toBe('lg');
    expect(result.current.variant).toBe('primary');
  });
});