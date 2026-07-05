import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectValue({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex-1 min-w-0 text-left truncate', className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        'flex items-center gap-2 h-12 px-4 py-2 rounded-xl border border-neutral-300 bg-white w-full outline-none font-semibold data-[placeholder]:font-medium data-[placeholder]:text-neutral-500',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <img src={chevronDownIcon} alt="" className="shrink-0 size-5 rotate-90 ml-auto" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          'z-50 max-h-96 min-w-(--radix-select-trigger-width) overflow-y-auto rounded-xl border border-neutral-300 bg-white p-1 shadow-card',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'cursor-pointer flex items-center px-3 py-2 rounded-lg text-md font-semibold text-neutral-800 tracking-t-2 outline-none data-[state=checked]:text-neutral-950 data-[highlighted]:bg-neutral-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
