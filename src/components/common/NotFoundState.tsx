import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundState({ message }: { message: string }) {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center gap-lg py-10'>
      <p className='text-sm font-medium text-neutral-500 tracking-t-2 text-center'>
        {message}
      </p>
      <Button
        type='button'
        variant='primary'
        className='w-50'
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>
    </div>
  );
}
