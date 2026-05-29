import { Outlet } from 'react-router-dom';
import { Header } from '../Header';

export const MarketingLayout = () => (
  <>
    <Header variant="marketing" />
    <main className="pt-16 md:pt-[4.5rem]">
      <Outlet />
    </main>
  </>
);

export default MarketingLayout;
