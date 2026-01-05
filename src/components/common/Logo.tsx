const Logo = ({ isAdmin }: { isAdmin?: boolean }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="rtl text-2xl font-bold text-academy-green">عندنا</span>
      <span className="rtl text-gray-600 text-xl">دورات لغوية</span>
    </div>
  );
};

export default Logo;
