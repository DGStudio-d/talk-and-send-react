import React from 'react';
import LogoComponent from '@/components/common/LogoComponent';
import Logo from '@/components/common/Logo';
import { useNavLogo, useHeroLogo } from '@/hooks/useResponsiveLogo';

const LogoDemo: React.FC = () => {
  const navLogo = useNavLogo();
  const heroLogo = useHeroLogo();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-academy-green">
          Learn Academy Logo Integration Demo
        </h1>
        
        <div className="space-y-12">
          {/* Logo Variants */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Logo Variants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Primary Logo</h3>
                <div className="flex justify-center">
                  <LogoComponent variant="primary" size="lg" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Secondary Logo</h3>
                <div className="flex justify-center">
                  <LogoComponent variant="secondary" size="lg" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Icon Logo</h3>
                <div className="flex justify-center">
                  <LogoComponent variant="icon" size="lg" />
                </div>
              </div>
            </div>
          </section>

          {/* Logo Sizes */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Logo Sizes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Small</h3>
                <div className="flex justify-center">
                  <LogoComponent size="sm" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Medium</h3>
                <div className="flex justify-center">
                  <LogoComponent size="md" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Large</h3>
                <div className="flex justify-center">
                  <LogoComponent size="lg" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Extra Large</h3>
                <div className="flex justify-center">
                  <LogoComponent size="xl" />
                </div>
              </div>
            </div>
          </section>

          {/* Responsive Logos */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Responsive Logos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Navigation Logo (Responsive)</h3>
                <div className="flex justify-center">
                  <LogoComponent size={navLogo.size} variant={navLogo.variant} />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Current: {navLogo.size} / {navLogo.variant}
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Hero Logo (Responsive)</h3>
                <div className="flex justify-center">
                  <LogoComponent size={heroLogo.size} variant={heroLogo.variant} />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Current: {heroLogo.size} / {heroLogo.variant}
                </p>
              </div>
            </div>
          </section>

          {/* Fallback Demo */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Fallback Handling</h2>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Logo with Broken Image (Shows Fallback)</h3>
              <div className="flex justify-center">
                <LogoComponent 
                  variant="primary" 
                  size="lg"
                  // This will trigger the fallback since the image doesn't exist
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                When logo image fails to load, a styled fallback with "LA" icon and text is shown
              </p>
            </div>
          </section>

          {/* Legacy Logo Component */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Legacy Logo Component (Backward Compatible)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Default</h3>
                <div className="flex justify-center">
                  <Logo />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Admin Context</h3>
                <div className="flex justify-center">
                  <Logo isAdmin={true} />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Large Size</h3>
                <div className="flex justify-center">
                  <Logo size="lg" />
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Features */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Interactive Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Clickable Logo (Link)</h3>
                <div className="flex justify-center">
                  <LogoComponent size="lg" />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Clicking navigates to home page
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Custom Click Handler</h3>
                <div className="flex justify-center">
                  <LogoComponent 
                    size="lg" 
                    onClick={() => alert('Custom click handler triggered!')}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Clicking shows alert instead of navigation
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LogoDemo;