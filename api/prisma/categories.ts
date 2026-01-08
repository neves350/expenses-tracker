import { Type } from 'src/generated/prisma/client'

export const Categories = [
	{
		icon: '💰',
		title: 'Salary',
		type: Type.INCOME,
	},
	{
		icon: '📈',
		title: 'Investments',
		type: Type.INCOME,
	},
	{
		icon: '🎁',
		title: 'Gifts',
		type: Type.INCOME,
	},
	{
		icon: '🍔',
		title: 'Food & Dining',
		type: Type.EXPENSE,
	},
	{
		icon: '🏠',
		title: 'Housing',
		type: Type.EXPENSE,
	},
	{
		icon: '🚗',
		title: 'Transportation',
		type: Type.EXPENSE,
	},
	{
		icon: '🎮',
		title: 'Entertainment',
		type: Type.EXPENSE,
	},
	{
		icon: '🏥',
		title: 'Healthcare',
		type: Type.EXPENSE,
	},
	{
		icon: '🛒',
		title: 'Shopping',
		type: Type.EXPENSE,
	},
]
