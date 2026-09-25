import hero640 from '@/assets/images/hero-banner-home-640.webp';
import hero800 from '@/assets/images/hero-banner-home-800.webp';
import hero1200 from '@/assets/images/hero-banner-home-1200.webp';
import { FadeInUp } from '@/components/common/StaggeredItems';

export default function HeroSection() {
  return (
    <section>
      <FadeInUp instant>
        <img
          src={hero1200}
          srcSet={`${hero640} 640w, ${hero800} 800w, ${hero1200} 1200w`}
          sizes='(min-width: 1280px) 1200px, calc(100vw - 32px)'
          width={1200}
          height={441}
          fetchPriority='high'
          alt='Welcome to Booky'
          className='w-full aspect-1200/441 object-cover rounded-4xl'
        />
      </FadeInUp>
    </section>
  );
}
