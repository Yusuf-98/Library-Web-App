import ProfileCard from '@/components/common/ProfileCard';
import { FadeInUp } from '@/components/common/StaggeredItems';

export default function AdminProfilePage() {
  return (
    <main className='flex-1 custom-container pt-[clamp(0px,calc(-40.57px+4.76vw),28px)] pb-xl md:pb-[clamp(16px,calc(-20.57px+4.762vw),48px)]'>
      <div className='flex flex-col gap-[clamp(15px,calc(4.71px+1.34vw),24px)] w-full md:w-150'>
        {/* Title */}
        <FadeInUp>
          <p className='font-bold text-neutral-950 tracking-t-none md:tracking-t-3 text-display-xs md:text-display-sm'>
            Profile
          </p>
        </FadeInUp>

        {/* Profile card */}
        <FadeInUp delay={80}>
          <ProfileCard idPrefix='admin-profile' />
        </FadeInUp>
      </div>
    </main>
  );
}
