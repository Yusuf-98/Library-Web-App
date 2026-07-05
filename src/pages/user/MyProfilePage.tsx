import ProfileCard from '@/components/common/ProfileCard';
import { FadeInUp } from '@/components/common/StaggeredItems';

export default function MyProfilePage() {
  return (
    <div className='w-full md:w-139.25 flex flex-col gap-3.75 md:gap-[clamp(15.04px,calc(4.8px+1.333vw),24px)]'>
      {/* Title */}
      <FadeInUp>
        <h1 className='font-bold text-neutral-950 md:tracking-t-3 text-display-xs md:text-[clamp(24px,calc(19.43px+0.595vw),28px)]'>
          Profile
        </h1>
      </FadeInUp>

      {/* Profile card */}
      <FadeInUp delay={250}>
        <ProfileCard idPrefix='profile' />
      </FadeInUp>
    </div>
  );
}
