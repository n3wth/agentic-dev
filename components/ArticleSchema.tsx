import React from 'react';

interface ArticleSchemaProps {
  title: string;
  description: string;
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  url: string;
  keywords?: string[];
  category?: string;
  wordCount?: number;
  siteName: string;
  siteUrl: string;
  logoUrl?: string;
}

export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  title,
  description,
  author = "Oliver N3wth",
  publishedAt,
  updatedAt,
  image,
  url,
  keywords = [],
  category,
  wordCount,
  siteName,
  siteUrl,
  logoUrl,
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image || `${siteUrl}/og-image.jpg`,
    "author": {
      "@type": "Person",
      "name": author,
      "url": `${siteUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": logoUrl || `${siteUrl}/logo.png`
      }
    },
    "datePublished": publishedAt,
    "dateModified": updatedAt || publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    ...(keywords.length > 0 && { "keywords": keywords.join(", ") }),
    ...(category && { "articleSection": category }),
    ...(wordCount && { "wordCount": wordCount })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ArticleSchema;
