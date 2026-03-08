'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/health');
      return response.data;
    }
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">SaaS Analytics Dashboard</h1>
      
      <div className="p-6 border rounded-lg bg-gray-50 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Backend Status:</h2>
        
        {isLoading && <p className="text-blue-500">Checking connection...</p>}
        
        {error && (
          <p className="text-red-500">
            Error: Could not connect to backend.
          </p>
        )}
        
        {data && (
          <p className="text-green-600 font-mono">
            {data.status === 'ok' ? '✅ Connected' : '⚠️ Unexpected Response'}
          </p>
        )}
      </div>
    </main>
  );
}