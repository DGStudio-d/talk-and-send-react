import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Languages } from "lucide-react";

interface LogoProps {
  isAdmin?: boolean;
  variant?: 'default' | 'icon-only' | 'compact';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LogoAlternative: React.FC<LogoProps> = ({ 
  isAdmin = false, 
  variant = 'default',
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', subtext: 'text-[10px]' },
    md: { icon: 'w-8 h-8', text: 'text-2xl', subtext: 'text-xs' },
    lg: { icon: 'w-10 h-10', text: 'text-3xl', subtext: 'text-sm' }
  };

  const sizes = sizeClasses[size];

  // Icon only variant
  if (variant === 'icon-only') {
    return (
      <Link 
        to={isAdmin ? "/admin" : "/"} 
        className={`flex items-center justify-center ${className}`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-academy-green to-emerald-600 rounded-xl blur-sm opacity-50"></div>
          <div className="relative bg-gradient-to-br from-academy-green to-emerald-600 rounded-xl p-2 shadow-lg">
            <Languages className={`${sizes.icon} text-white`} />
          </div>
        </div>
      </Link>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link 
        to={isAdmin ? "/admin" : "/"} 
        className={`flex items-center gap-2 ${className}`}
      >
        <div className="bg-gradient-to-br from-academy-green to-emerald-600 rounded-lg p-1.5 shadow-md">
          <GraduationCap className={`${sizes.icon} text-white`} />
        </div>
        <span className={`${sizes.text} font-bold bg-gradient-to-r from-academy-green to-emerald-600 bg-clip-text text-transparent`}>
          Learn Academy
        </span>
      </Link>
    );
  }

  // Default variant - full logo
  return (
    <Link 
      to={isAdmin ? "/admin" : "/"} 
      className={`flex items-center gap-3 ${className}`}
    >
      {/* Icon with gradient background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-academy-green to-emerald-600 rounded-xl blur-sm opacity-50"></div>
        <div className="relative bg-gradient-to-br from-academy-green to-emerald-600 rounded-xl p-2 shadow-lg">
          <BookOpen className={`${sizes.icon} text-white`} />
        </div>
      </div>
      
      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className={`${sizes.text} font-bold bg-gradient-to-r from-academy-green to-emerald-600 bg-clip-text text-transparent`}>
          Learn Academy
        </span>
        <span className={`${sizes.subtext} text-gray-500 font-medium`}>
          Language Learning Platform
        </span>
      </div>
    </Link>
  );
};

export default LogoAlternative;
