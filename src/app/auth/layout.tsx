import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-800 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent bg-opacity-10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent bg-opacity-10 rounded-full -ml-48 -mb-48"></div>

        <div className="relative z-10 text-white text-center">
          <div className="mb-8">
            <Image
              src="/itgo-logo.svg"
              alt="ITGO"
              width={200}
              height={200}
              priority
              className="mx-auto mb-4"
            />
          </div>
          <h1 className="text-5xl font-bold mb-4">ITGO</h1>
          <p className="text-2xl font-light text-accent">
            Tu equipo TI, cuando lo necesitas
          </p>
          <div className="mt-12 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent bg-opacity-20">
                  <svg
                    className="h-6 w-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-lg">Especialistas certificados</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent bg-opacity-20">
                  <svg
                    className="h-6 w-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-lg">Respuesta rápida</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent bg-opacity-20">
                  <svg
                    className="h-6 w-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-lg">Precios competitivos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Image
              src="/logo-mobile.svg"
              alt="ITGO"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-primary-700">ITGO</h1>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
