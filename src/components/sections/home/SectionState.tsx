export function SectionLoading() {
  return (
    <div className='flex justify-center py-6'>
      <span className='size-6 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
    </div>
  );
}

export function SectionError({ message }: { message: string }) {
  return (
    <p className='text-sm text-accent-red tracking-t-2 py-6 text-center'>
      {message}
    </p>
  );
}
