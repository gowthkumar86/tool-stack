import Card from "./ui/card";
import Skeleton from "./ui/skeleton";

function PageLoadingState() {
  return (
    <div className="space-y-6">
      <Card>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-3 h-4 w-full max-w-3xl" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-4 h-44 w-full" />
        </Card>
        <Card>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-4 h-44 w-full" />
        </Card>
      </div>
    </div>
  );
}

export default PageLoadingState;
