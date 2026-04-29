import { forwardRef } from "react";
import { Link } from "react-router-dom";
import type { Article } from "@/data/mock";

type ArticleCardProps = {
  article: Article;
  variant?: "default" | "compact" | "minimal";
};

export const ArticleCard = forwardRef<HTMLAnchorElement, ArticleCardProps>(({
  article,
  variant = "default",
}, ref) => {
  if (variant === "minimal") {
    return (
      <Link ref={ref} to={`/yazi/${article.slug}`} className="article-card group block py-6 border-b border-hairline">
        <div className="flex items-center gap-2 mb-3">
          <span className="tag">{article.kind}</span>
          <span className="text-xs text-muted-foreground">{article.publishedAt}</span>
        </div>
        <h3 className="card-title font-display text-xl md:text-2xl font-bold leading-tight text-balance">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-3 text-xs text-muted-foreground">
          {article.author.name} · {article.readMinutes} dk okuma
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link ref={ref} to={`/yazi/${article.slug}`} className="article-card group flex gap-4 items-start p-3 -mx-3 rounded-2xl hover:bg-secondary/60 transition-colors">
        <div className="flex-1 min-w-0">
          <span className="tag">{article.category}</span>
          <h3 className="card-title font-display text-base md:text-lg font-bold leading-snug mt-2 text-balance">
            {article.title}
          </h3>
          <div className="mt-2 text-xs text-muted-foreground">
            {article.author.name} · {article.readMinutes} dk
          </div>
        </div>
        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
          <img
            src={article.cover}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link ref={ref} to={`/yazi/${article.slug}`} className="article-card group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary mb-4">
        <img
          src={article.cover}
          alt=""
          loading="lazy"
          width={1280}
          height={800}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute top-3 left-3">
          <span className="tag bg-background/95 backdrop-blur-sm">{article.kind}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mb-2 font-medium">
        {article.publishedAt} · {article.readMinutes} dk okuma
      </div>
      <h3 className="card-title font-display text-xl md:text-2xl font-bold leading-tight text-balance">
        {article.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {article.excerpt}
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-foreground/70">
        <img src={article.author.avatar} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-background" />
        <span className="font-medium">{article.author.name}</span>
      </div>
    </Link>
  );
});
ArticleCard.displayName = "ArticleCard";
