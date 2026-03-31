import { Mail, Lock, Eye, Pill } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo Section */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Pill size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">PharmaCare</h1>
        </div>

        {/* Card */}
        <div className="bg-white border rounded-xl shadow-sm p-6">

          {/* Card Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  className="w-full border rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" />
                Remember me
              </label>

              <a
                href="#"
                className="text-blue-600 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="border-t"></div>

            <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 text-xs text-gray-400 uppercase">
              Demo Accounts
            </span>
          </div>

          {/* Demo Accounts */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button className="border rounded-md py-2 text-xs hover:bg-gray-50">
              Customer
            </button>

            <button className="border rounded-md py-2 text-xs hover:bg-gray-50">
              Pharmacist
            </button>

            <button className="border rounded-md py-2 text-xs hover:bg-gray-50">
              Admin
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="#"
              className="text-blue-600 font-medium hover:underline"
            >
              Create an account
            </a>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="hover:underline text-gray-700">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="hover:underline text-gray-700">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}