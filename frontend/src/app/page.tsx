'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RegisterForm } from '@/components/RegistrationForm';

export default function Home() {
  const { data: health, isLoading: isHealthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/health`);
      return response.data;
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 md:p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            FlowForge
          </h1>
          <p className="text-muted-foreground">
            Modular project management for developers.
          </p>
        </div>

        {/* Your Register Form */}
        <RegisterForm />

        {/* Minimalist Backend Status Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-8">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${health?.status === 'ok' ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${health?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
          {isHealthLoading ? 'Checking backend...' : `Backend: ${health?.status === 'ok' ? 'Online' : 'Offline'}`}
        </div>
      </div>
    </main>
  );
}