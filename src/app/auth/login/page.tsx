'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, setError, error, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Por favor ingresa email y contraseña');
      return;
    }

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setLocalError(error || 'Error al iniciar sesión');
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    try {
      await login(demoEmail, demoPassword);
      router.push('/dashboard');
    } catch (err) {
      setLocalError('Error al iniciar sesión de demostración');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenido a ITGO
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tu equipo TI, cuando lo necesitas
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {(localError || error) && (
          <div className="bg-error bg-opacity-10 border border-error text-error px-4 py-3 rounded-lg">
            {localError || error}
          </div>
        )}

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            disabled={isLoading}
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            required
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-600 dark:text-gray-400">Recuérdame</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-primary-700 hover:text-primary-800 dark:text-primary-400"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            O inicia con
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          disabled={isLoading}
          className="btn btn-outline flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google</span>
        </button>
        <button
          type="button"
          disabled={isLoading}
          className="btn btn-outline flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M11.4 24c6.3 0 9.9-5.1 9.9-9.9 0-.2 0-.4 0-.6 1.4-1 2.6-2.3 3.6-3.7-1.2.5-2.6.9-4 1.1 1.4-.8 2.5-2.1 3-3.7-1.3.8-2.7 1.3-4.2 1.6-.6-.7-1.5-1.1-2.5-1.1-2 0-3.6 1.6-3.6 3.6 0 .3 0 .6.1.9-3 -.2-5.7-1.6-7.5-3.8-.3.5-.5 1.1-.5 1.8 0 1.2.6 2.3 1.6 3-.6 0-1.1-.2-1.6-.5v.1c0 1.8 1.3 3.3 3 3.6-.3.1-.6.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.8 2.6 3.4 2.6-1.3 1-3 1.6-4.8 1.6h-.9c1.7 1.1 3.7 1.7 5.8 1.7z"
            />
          </svg>
          <span>Microsoft</span>
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link
            href="/auth/register"
            className="text-primary-700 hover:text-primary-800 font-medium dark:text-primary-400"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>

      {/* Demo Credentials */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
          Credenciales de demostración:
        </p>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Admin:</strong> admin@itgo.com / password
            </p>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@itgo.com', 'password')}
              disabled={isLoading}
              className="btn btn-sm btn-outline"
            >
              Usar cuenta admin
            </button>
          </div>
          <div className="pt-2">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Cliente:</strong> cliente1@pyme.com / password
            </p>
            <button
              type="button"
              onClick={() => handleDemoLogin('cliente1@pyme.com', 'password')}
              disabled={isLoading}
              className="btn btn-sm btn-outline"
            >
              Usar cuenta cliente
            </button>
          </div>
          <div className="pt-2">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Especialista:</strong> especialista1@itgo.com / password
            </p>
            <button
              type="button"
              onClick={() => handleDemoLogin('especialista1@itgo.com', 'password')}
              disabled={isLoading}
              className="btn btn-sm btn-outline"
            >
              Usar cuenta especialista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
