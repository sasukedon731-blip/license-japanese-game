import Image from "next/image"

const APP_NAME = "外免切替 Japanese Learning App"

type Props = {
  size?: number
  priority?: boolean
}

export default function AppLogo({ size = 40, priority = false }: Props) {
  return (
    <Image
      src="/icons/icon-192.png"
      alt={APP_NAME}
      width={size}
      height={size}
      priority={priority}
      className="appLogoImage"
    />
  )
}
