import type {
  ButtonHTMLAttributes,
  MouseEventHandler,
  Ref,
  ReactNode,
} from "react"

import { cn } from "@/lib/utils"

type ButtonSize = "sm" | "md" | "lg"

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick"
> & {
  bgColor?: string
  size?: ButtonSize | "icon" | "icon-sm" | "icon-lg"
  icon?: ReactNode
  text?: ReactNode
  children?: ReactNode
  ref?: Ref<HTMLButtonElement>
  buttonHandler?: MouseEventHandler<HTMLButtonElement>
  classes?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "",
  md: "",
  lg: "",
  icon: "size-8",
  "icon-sm": "size-7",
  "icon-lg": "size-9",
}

export function Button({
  bgColor = "bg-white",
  size = "md",
  icon,
  text,
  children,
  ref,
  buttonHandler,
  classes,
  className,
  onClick,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-sans transition-colors hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500",
        bgColor,
        sizeClasses[size],
        classes,
        className,
        "text-xs",
        size.startsWith("icon") ? "p-0" : "h-11 px-4.5 py-4"
      )}
      onClick={buttonHandler ?? onClick}
      {...props}
    >
      {icon}
      {text ?? children}
    </button>
  )
}

export default Button
