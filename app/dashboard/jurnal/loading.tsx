import { JurnalSkeleton } from "@/components/common/SkeletonComponents"

export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <JurnalSkeleton />
    </div>
  )
}