import fiction from '@/assets/icons/categories/fiction.png';
import nonFiction from '@/assets/icons/categories/non-fiction.png';
import finance from '@/assets/icons/categories/finance.png';
import science from '@/assets/icons/categories/science.png';
import education from '@/assets/icons/categories/education.png';
import selfImprovement from '@/assets/icons/categories/self-improvement.png';

const CATEGORY_ICON_MAP: Record<string, string> = {
  fiction,
  'non-fiction': nonFiction,
  finance: finance,
  science: science,
  'science-fiction': fiction,
  education: education,
  'self-improvement': selfImprovement,
  lifestyle: finance,
  religious: education,
};

/** Categories shown on the home page and in filters, in display order */
export const HOME_CATEGORY_ORDER = [
  'Fiction',
  'Non-Fiction',
  'Self-Improvement',
  'Finance',
  'Science',
  'Education',
  'Lifestyle',
  'Religious',
  'Science-Fiction',
];

export function getCategoryIcon(categoryName: string): string {
  const key = categoryName.trim().toLowerCase();
  return CATEGORY_ICON_MAP[key] ?? fiction;
}
