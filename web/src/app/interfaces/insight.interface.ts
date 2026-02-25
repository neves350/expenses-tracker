import type { LucideIconData } from 'lucide-angular'
import type { ZardBadgeVariants } from '@/shared/components/ui/badge'

export interface Insight {
	icon: LucideIconData
	badge: {
		label: string
		type: ZardBadgeVariants['zType']
	}
	message: string
	border: string
	bg: string
}
