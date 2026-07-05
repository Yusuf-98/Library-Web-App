import heroBanner from '@/assets/images/hero-banner-home.png';
import { FadeInUp } from '@/components/common/StaggeredItems';

export default function HeroSection() {
  return (
    <section>
      <FadeInUp>
        <img
          src={heroBanner}
          alt='Welcome to Booky'
          className='w-full aspect-1200/441 object-cover rounded-4xl'
        />
      </FadeInUp>
    </section>
  );
}
