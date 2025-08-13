import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

interface Category {
  id: string
  name: string
  icon: LucideIcon
  description: string
  color: string
  count: number
}

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon

  return (
    <Link href={`/events?category=${category.id}`}>
      <GlassCard hover className="text-center p-6 h-full">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-4`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-display font-semibold text-lg mb-2">{category.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{category.description}</p>
        <div className="text-xs text-gray-500">{category.count} events</div>
      </GlassCard>
    </Link>
  )
}
