export function SectionError({ message }: { message: string }) {
  return (
    <p className='text-sm text-accent-red tracking-t-2 py-6 text-center'>
      {message}
    </p>
  );
}
