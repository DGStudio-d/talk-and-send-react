import LogoComponent from './LogoComponent';

interface LogoProps {
  isAdmin?: boolean;
  variant?: 'main' | 'white' | 'icon' | 'primary' | 'secondary' | 'alternative1' | 'alternative2';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ 
  isAdmin = false, 
  variant = 'primary',
  className = '',
  size = 'md',
  onClick
}) => {
  // Map legacy variant names to new ones for backward compatibility
  const variantMap = {
    main: 'primary' as const,
    white: 'secondary' as const,
    icon: 'icon' as const,
    primary: 'primary' as const,
    secondary: 'secondary' as const,
    alternative1: 'alternative1' as const,
    alternative2: 'alternative2' as const,
  };

  const mappedVariant = variantMap[variant] || 'primary';

  return (
    <LogoComponent
      variant={mappedVariant}
      size={size}
      className={className}
      isAdmin={isAdmin}
      onClick={onClick}
      asLink={true}
      showLoading={true}
      showFallback={true}
    />
  );
};

export default Logo;
