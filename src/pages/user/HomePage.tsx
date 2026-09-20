import Footer from '@/components/shared/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import HeroSection from '@/components/sections/home/HeroSection';
import CategorySection from '@/components/sections/home/CategorySection';
import RecommendationSection from '@/components/sections/home/RecommendationSection';
import PopularAuthorsSection from '@/components/sections/home/PopularAuthorsSection';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Handlers ---
  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };
  return (
    <>
      <main className='flex-1 custom-container flex flex-col pt-xl md:pt-[clamp(16px,calc(-20.57px+4.762vw),48px)] gap-xl md:gap-[clamp(16px,calc(-20.57px+4.762vw),48px)]'>
        <HeroSection />
        <CategorySection />
        <RecommendationSection />

        {/* Divider */}
        <div className='h-px w-full bg-neutral-300 my-2 md:my-0' />

        <PopularAuthorsSection />
      </main>

      <Footer onLogoClick={handleLogoClick} />
    </>
  );
}
