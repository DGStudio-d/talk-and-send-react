import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LogoComponent from '../LogoComponent';

// Mock the logo constants
jest.mock('@/constants/logos', () => ({
  LOGO_CONFIG: {
    PRIMARY: '/assets/logos/Asset 1@2x.png',
    SECONDARY: '/assets/logos/Asset 2@2x.png',
    ICON: '/assets/logos/Asset 3@2x.png',
    ALTERNATIVE_1: '/assets/logos/Asset 4@2x.png',
    ALTERNATIVE_2: '/assets/logos/Asset 5@2x.png',
  }
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LogoComponent', () => {
  it('renders logo image with correct src', () => {
    renderWithRouter(<LogoComponent />);
    
    const logoImage = screen.getByAltText('Learn Academy Logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/assets/logos/Asset 1@2x.png');
  });

  it('renders as a link by default', () => {
    renderWithRouter(<LogoComponent />);
    
    const logoLink = screen.getByRole('link');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders with admin path when isAdmin is true', () => {
    renderWithRouter(<LogoComponent isAdmin={true} />);
    
    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveAttribute('href', '/admin');
  });

  it('renders different logo variants', () => {
    const { rerender } = renderWithRouter(<LogoComponent variant="secondary" />);
    
    let logoImage = screen.getByAltText('Learn Academy Logo');
    expect(logoImage).toHaveAttribute('src', '/assets/logos/Asset 2@2x.png');

    rerender(
      <BrowserRouter>
        <LogoComponent variant="icon" />
      </BrowserRouter>
    );
    
    logoImage = screen.getByAltText('Learn Academy Logo');
    expect(logoImage).toHaveAttribute('src', '/assets/logos/Asset 3@2x.png');
  });

  it('applies correct size classes', () => {
    const { rerender } = renderWithRouter(<LogoComponent size="sm" />);
    
    let logoImage = screen.getByAltText('Learn Academy Logo');
    expect(logoImage).toHaveClass('h-8');

    rerender(
      <BrowserRouter>
        <LogoComponent size="lg" />
      </BrowserRouter>
    );
    
    logoImage = screen.getByAltText('Learn Academy Logo');
    expect(logoImage).toHaveClass('h-16');
  });

  it('calls custom onClick handler when provided', () => {
    const mockOnClick = jest.fn();
    renderWithRouter(<LogoComponent onClick={mockOnClick} />);
    
    const logoLink = screen.getByRole('link');
    fireEvent.click(logoLink);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('shows fallback when image fails to load', () => {
    renderWithRouter(<LogoComponent />);
    
    const logoImage = screen.getByAltText('Learn Academy Logo');
    
    // Simulate image load error
    fireEvent.error(logoImage);
    
    // Should show fallback text
    expect(screen.getByText('Learn Academy')).toBeInTheDocument();
    expect(screen.getByText('Language Learning Platform')).toBeInTheDocument();
  });

  it('renders as button when asLink is false', () => {
    renderWithRouter(<LogoComponent asLink={false} />);
    
    const logoButton = screen.getByRole('button');
    expect(logoButton).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithRouter(<LogoComponent />);
    
    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveAttribute('aria-label', 'Learn Academy - Go to home page');
  });
});