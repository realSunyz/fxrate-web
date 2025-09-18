'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';

import { useControlledState } from '@/hooks/use-controlled-state';
import { getStrictContext } from '@/lib/get-strict-context';

type DialogContextType = {
  isOpen: boolean;
  setIsOpen: DialogProps['onOpenChange'];
};

const [DialogProvider, useDialog] =
  getStrictContext<DialogContextType>('DialogContext');

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;

function Dialog(props: DialogProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });

  return (
    <DialogProvider value={{ isOpen, setIsOpen }}>
      <DialogPrimitive.Root
        data-slot="dialog"
        {...props}
        onOpenChange={setIsOpen}
      />
    </DialogProvider>
  );
}

type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;

function DialogTrigger(props: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

type DialogPortalProps = Omit<
  React.ComponentProps<typeof DialogPrimitive.Portal>,
  'forceMount'
>;

function DialogPortal(props: DialogPortalProps) {
  const { isOpen } = useDialog();

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogPrimitive.Portal
          data-slot="dialog-portal"
          forceMount
          {...props}
        />
      )}
    </AnimatePresence>
  );
}

type DialogOverlayProps = Omit<
  React.ComponentProps<typeof DialogPrimitive.Overlay>,
  'forceMount' | 'asChild'
> &
  HTMLMotionProps<'div'>;

function DialogOverlay({
  transition = { duration: 0.2, ease: 'easeInOut' },
  ...props
}: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay data-slot="dialog-overlay" asChild forceMount>
      <motion.div
        key="dialog-overlay"
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(4px)' }}
        transition={transition}
        {...props}
      />
    </DialogPrimitive.Overlay>
  );
}

type DialogFlipDirection = 'top' | 'bottom' | 'left' | 'right';

type DialogContentProps = Omit<
  React.ComponentProps<typeof DialogPrimitive.Content>,
  'forceMount' | 'asChild'
> &
  HTMLMotionProps<'div'> & {
    from?: DialogFlipDirection;
  };

function DialogContent({
  from = 'top',
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  transition = { type: 'spring', stiffness: 150, damping: 25 },
  ...props
}: DialogContentProps) {
  const initialRotation =
    from === 'bottom' || from === 'left' ? '20deg' : '-20deg';
  const isVertical = from === 'top' || from === 'bottom';
  const rotateAxis = isVertical ? 'rotateX' : 'rotateY';
  const baseTranslate = 'translate(-50%, -50%)';
  const basePerspective = 'perspective(500px)';
  const initialTransform = `${baseTranslate} ${basePerspective} ${rotateAxis}(${initialRotation}) scale(0.8)`;
  const finalTransform = `${baseTranslate} ${basePerspective} ${rotateAxis}(0deg) scale(1)`;

  return (
    <DialogPrimitive.Content
      asChild
      forceMount
      onOpenAutoFocus={onOpenAutoFocus}
      onCloseAutoFocus={onCloseAutoFocus}
      onEscapeKeyDown={onEscapeKeyDown}
      onPointerDownOutside={onPointerDownOutside}
      onInteractOutside={onInteractOutside}
    >
      <motion.div
        key="dialog-content"
        data-slot="dialog-content"
        initial={{
          opacity: 0,
          filter: 'blur(4px)',
          transform: initialTransform,
        }}
        animate={{
          opacity: 1,
          filter: 'blur(0px)',
          transform: finalTransform,
        }}
        exit={{
          opacity: 0,
          filter: 'blur(4px)',
          transform: initialTransform,
        }}
        transition={transition}
        {...props}
      />
    </DialogPrimitive.Content>
  );
}

type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;

function DialogClose(props: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

type DialogHeaderProps = React.ComponentProps<'div'>;

function DialogHeader(props: DialogHeaderProps) {
  return <div data-slot="dialog-header" {...props} />;
}

type DialogFooterProps = React.ComponentProps<'div'>;

function DialogFooter(props: DialogFooterProps) {
  return <div data-slot="dialog-footer" {...props} />;
}

type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;

function DialogTitle(props: DialogTitleProps) {
  return <DialogPrimitive.Title data-slot="dialog-title" {...props} />;
}

type DialogDescriptionProps = React.ComponentProps<
  typeof DialogPrimitive.Description
>;

function DialogDescription(props: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description data-slot="dialog-description" {...props} />
  );
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  useDialog,
  type DialogProps,
  type DialogTriggerProps,
  type DialogPortalProps,
  type DialogCloseProps,
  type DialogOverlayProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogContextType,
  type DialogFlipDirection,
};
