import { articles, type Article } from "./mock";

const map = new Map<string, Article>(articles.map((a) => [a.slug, a]));

export const getArticleBySlug = (slug: string): Article | undefined => map.get(slug);
export const getArticlesBySlugs = (slugs: string[]): Article[] =>
  slugs.map((s) => map.get(s)).filter((a): a is Article => Boolean(a));