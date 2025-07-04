// File: src/react-query.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Updated import
import React from 'react'; // Import React for React.ReactNode

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 5, // 5 minutes
      cacheTime: 60 * 1000 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
