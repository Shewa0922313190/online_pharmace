import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { useCart } from '../../Contexts/CartContext';
import { Button } from '../../uti/button';
import { Badge } from '../../uti/badge';
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Pill,
  LayoutDashboard,
  Package,
  FileText,
  Search,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (hasRole(['admin'])) return '/admin/dashboard';
    if (hasRole(['pharmacist'])) return '/pharmacist/dashboard';
    return '/customer/dashboard';
  };

  const renderNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/products') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Products
          </Link>
        </>
      );
    }

    if (hasRole(['admin'])) {
      return (
        <>
          <Link
            to="/admin/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/admin/dashboard') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/admin/users') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Users
          </Link>
          <Link
            to="/admin/products"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/admin/products') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Products
          </Link>
          <Link
            to="/admin/reports"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/admin/reports') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Reports
          </Link>
        </>
      );
    }

    if (hasRole(['pharmacist'])) {
      return (
        <>
          <Link
            to="/pharmacist/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/pharmacist/dashboard') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/pharmacist/prescriptions"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/pharmacist/prescriptions') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Prescriptions
          </Link>
          <Link
            to="/pharmacist/orders"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/pharmacist/orders') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Orders
          </Link>
          <Link
            to="/pharmacist/inventory"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/pharmacist/inventory') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Inventory
          </Link>
        </>
      );
    }

    // Customer links
    return (
      <>
        <Link
          to="/"
          className={`text-sm font-medium transition-colors hover:text-primary ${
            isActive('/') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Home
        </Link>
        <Link
          to="/products"
          className={`text-sm font-medium transition-colors hover:text-primary ${
            isActive('/products') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Products
        </Link>
        <Link
          to="/customer/orders"
          className={`text-sm font-medium transition-colors hover:text-primary ${
            isActive('/customer/orders') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          My Orders
        </Link>
        <Link
          to="/customer/prescriptions"
          className={`text-sm font-medium transition-colors hover:text-primary ${
            isActive('/customer/prescriptions') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Prescriptions
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Pill className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold hidden sm:inline">PharmaCare</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">{renderNavLinks()}</div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => navigate('/products')}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart - Only for customers or non-authenticated users */}
          {(!isAuthenticated || hasRole(['customer'])) && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartCount() > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {getCartCount()}
                </Badge>
              )}
            </Button>
          )}

          {/* User Menu - REPLACED WITH LOCAL HTML */}
          {isAuthenticated ? (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="h-5 w-5" />
              </Button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-background shadow-lg z-50 py-1">
                  {/* User Info Header */}
                  <div className="flex items-center gap-2 p-2 border-b border-border">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user?.first_name} {user?.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <button 
                    onClick={() => { navigate(getDashboardLink()); setUserMenuOpen(false); }}
                    className="w-full flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </button>
                  
                  {hasRole(['customer']) && (
                    <>
                      <button 
                        onClick={() => { navigate('/customer/profile'); setUserMenuOpen(false); }}
                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                      <button 
                        onClick={() => { navigate('/customer/orders'); setUserMenuOpen(false); }}
                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </button>
                      <button 
                        onClick={() => { navigate('/customer/prescriptions'); setUserMenuOpen(false); }}
                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Prescriptions
                      </button>
                    </>
                  )}
                  
                  {/* Separator */}
                  <div className="h-px bg-border my-1" />
                  
                  {/* Logout */}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 flex flex-col gap-4">
            {renderNavLinks()}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                  Login
                </Button>
                <Button variant="outline" onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;