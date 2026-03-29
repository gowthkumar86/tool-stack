import { cn } from "../../lib/cn";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton rounded-xl", className)} aria-hidden="true" />;
}

export default Skeleton;
