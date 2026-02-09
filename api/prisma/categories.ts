import { Type } from 'src/generated/prisma/client'

export const Categories = [
	/**
	 * INCOMES
	 */
	{
		icon: 'briefcase',
		title: 'Salary',
		type: Type.INCOME,
	},
	{
		icon: 'chart-no-axes-combined',
		title: 'Investments',
		type: Type.INCOME,
	},
	{
		icon: 'shopping-bag',
		title: 'Sales',
		type: Type.INCOME,
	},
	{
		icon: 'gift',
		title: 'Gifts',
		type: Type.INCOME,
	},
	{
		icon: 'rotate-ccw',
		title: 'Refund',
		type: Type.INCOME,
	},
	{
		icon: 'tag',
		title: 'Others',
		type: Type.INCOME,
	},

	/**
	 * EXPENSES
	 */
	{
		icon: 'utensils',
		title: 'Food & Dining',
		type: Type.EXPENSE,
	},
	{
		icon: 'house',
		title: 'Housing',
		type: Type.EXPENSE,
	},
	{
		icon: 'car',
		title: 'Transportation',
		type: Type.EXPENSE,
	},
	{
		icon: 'joystick',
		title: 'Entertainment',
		type: Type.EXPENSE,
	},
	{
		icon: 'bandage',
		title: 'Healthcare',
		type: Type.EXPENSE,
	},
	{
		icon: 'shopping-basket',
		title: 'Shopping',
		type: Type.EXPENSE,
	},
	{
		icon: 'graduation-cap',
		title: 'Education',
		type: Type.EXPENSE,
	},
	{
		icon: 'shirt',
		title: 'Clothes',
		type: Type.EXPENSE,
	},
	{
		icon: 'paw-print',
		title: 'Pets',
		type: Type.EXPENSE,
	},
	{
		icon: 'gift',
		title: 'Gifts',
		type: Type.EXPENSE,
	},
	{
		icon: 'repeat-2',
		title: 'Subscriptions',
		type: Type.EXPENSE,
	},
	{
		icon: 'circle-dollar-sign',
		title: 'Taxes',
		type: Type.EXPENSE,
	},
	{
		icon: 'tag',
		title: 'Others',
		type: Type.EXPENSE,
	},
]
