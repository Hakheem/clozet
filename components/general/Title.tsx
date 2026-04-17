import { cn } from "@/lib/utils";

interface Props{
    children: React.ReactNode;
    className?: string
}

const Title = ({children, className}: Props) => {
  return (
  <h2 className={cn("title text-2xl font-bold", className)} > {children} </h2>
  )
}

export default Title