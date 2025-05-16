import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductPage from './pages/ProductPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductPage />
    </QueryClientProvider>
  );
}

export default App;