import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
