import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
  Memorial buttons (DESIGN.md, Buttons). Built on the shadcn / Base UI button.
  Every button has a text label; an icon may sit beside it, never alone.
  Press scale only for pointer and touch, and only without reduced motion.
*/
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-control",
    "font-sans select-none no-underline",
    "transition-[background-color,border-color,color,transform] duration-(--duration-press) ease-out",
    "motion-safe:active:scale-[0.98]",
    "aria-disabled:cursor-not-allowed aria-disabled:border-dashed aria-disabled:border-edge aria-disabled:bg-hidden-surface aria-disabled:text-ink-muted",
    "disabled:cursor-not-allowed disabled:border-dashed disabled:border-edge disabled:bg-hidden-surface disabled:text-ink-muted",
    "[&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // Primary: ink fill, 56 px, the main action of a surface.
        primary:
          "h-target-primary border-2 border-ink bg-ink px-6 text-label-strong text-on-ink [@media(hover:hover)_and_(pointer:fine)]:hover:bg-ink-muted [@media(hover:hover)_and_(pointer:fine)]:hover:border-ink-muted",
        // Secondary: paper fill, 2 px edge border, 48 px.
        secondary:
          "h-target-min border-2 border-edge bg-paper px-5 text-label text-ink [@media(hover:hover)_and_(pointer:fine)]:hover:border-ink",
      },
      width: {
        auto: "",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      width: "auto",
    },
  }
)

function Button({
  className,
  variant,
  width,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, width }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
