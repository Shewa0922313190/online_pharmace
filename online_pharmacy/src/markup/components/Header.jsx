import { useState } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  Pill,
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
  Users,
  ClipboardList
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // demo role: guest | admin | pharmacist | customer
  const role = "pharmacist";

  const getLinks = () => {
    if (role === "admin") return ["Dashboard", "Users", "Products", "Reports"];
    if (role === "pharmacist")
      return ["Dashboard", "Prescriptions", "Orders", "Inventory"];
    if (role === "customer")
      return ["Home", "Products", "My Orders", "Prescriptions"];
    return ["Home", "Products"];
  };

  const getUserMenu = () => {
    if (role === "admin") {
      return [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Users", icon: Users },
        { name: "Reports", icon: ClipboardList }
      ];
    }

    if (role === "pharmacist") {
      return [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Prescriptions", icon: FileText },
        { name: "Orders", icon: Package }
      ];
    }

    if (role === "customer") {
      return [
        { name: "Profile", icon: User },
        { name: "My Orders", icon: Package },
        { name: "Prescriptions", icon: FileText }
      ];
    }

    return [];
  };

  const links = getLinks();
  const userMenu = getUserMenu();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <span className="hidden sm:block text-lg font-bold text-gray-800">
            PharmaCare
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link, i) => (
            <a
              key={i}
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 relative">

          {/* Search */}
          <button className="hidden sm:flex p-2 rounded-md hover:bg-gray-100">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Cart */}
          {(role === "guest" || role === "customer") && (
            <button className="relative p-2 rounded-md hover:bg-gray-100">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                2
              </span>
            </button>
          )}

          {/* Guest buttons */}
          {role === "guest" ? (
            <div className="hidden sm:flex items-center gap-2">
              <button className="px-3 py-1 text-sm font-medium rounded-md hover:bg-gray-100">
                Login
              </button>
              <button className="px-3 py-1 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Register
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* User Icon */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-md">

                  {/* User Info */}
                  <div className="flex items-center gap-2 p-3 border-b">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                  </div>

                  {/* Dynamic Menu */}
                  <div className="py-2">
                    {userMenu.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={i}
                          href="#"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                        >
                          <Icon className="w-4 h-4" />
                          {item.name}
                        </a>
                      );
                    })}
                  </div>

                  {/* Logout */}
                  <div className="border-t py-2">
                    <a
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </a>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>
    </nav>
  );
}