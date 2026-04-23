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
        <div className="flex items-baseline gap-3 mb-2">
          <span className="eyebrow text-accent">{article.kind}</span>
          <span className="text-xs text-muted-foreground">· {article.publishedAt}</span>
        </div>
        <h3 className="card-title font-display text-2xl leading-snug text-balance">
          {article.title}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed text-pretty line-clamp-2">
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
      <Link to={`/yazi/${article.slug}`} className="article-card group flex gap-4 items-start">
        <div className="flex-1 min-w-0">
          <span className="eyebrow text-accent">{article.category}</span>
          <h3 className="card-title font-display text-lg leading-snug mt-1 text-balance">
            {article.title}
          </h3>
          <div className="mt-2 text-xs text-muted-foreground">
            {article.author.name} · {article.readMinutes} dk
          </div>
        </div>
        <div className="w-20 h-20 shrink-0 overflow-hidden bg-secondary">
          <img
            src={article.cover}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/yazi/${article.slug}`} className="article-card group block">
      <div className="aspect-[4/3] overflow-hidden bg-secondary mb-5">
        <img
          src={article.cover}
          alt=""
          loading="lazy"
          width={1280}
          height={800}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="eyebrow text-accent">{article.kind}</span>
        <span className="text-xs text-muted-foreground">· {article.publishedAt}</span>
      </div>
      <h3 className="card-title font-display text-2xl leading-snug text-balance">
        {article.title}
      </h3>
      <p className="mt-2 text-muted-foreground leading-relaxed line-clamp-2">
        {article.excerpt}
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <img src={article.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
        <span>{article.author.name}</span>
        <span>·</span>
        <span>{article.readMinutes} dk okuma</span>
      </div>
    </Link>
  );
};
