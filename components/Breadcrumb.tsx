import React from 'react';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  siteUrl: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, siteUrl }) => {
  // Schema for SEO
  const schemaItems = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    ...(item.url && { "item": `${siteUrl}${item.url}` })
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": schemaItems
  };

  return (
    <>
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Visual Breadcrumb */}
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb">
          {items.map((item, index) => (
            <li key={index} className="breadcrumb-item">
              {item.url && index < items.length - 1 ? (
                <a href={item.url}>{item.name}</a>
              ) : (
                <span aria-current={index === items.length - 1 ? "page" : undefined}>
                  {item.name}
                </span>
              )}
              {index < items.length - 1 && <span className="breadcrumb-separator"> / </span>}
            </li>
          ))}
        </ol>
      </nav>

      {/* Styles */}
      <style jsx>{`
        .breadcrumb-nav {
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .breadcrumb {
          display: flex;
          flex-wrap: wrap;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .breadcrumb-item {
          display: flex;
          align-items: center;
        }
        
        .breadcrumb-item a {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .breadcrumb-item a:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .breadcrumb-item span[aria-current="page"] {
          color: #1f2937;
          font-weight: 500;
        }
        
        .breadcrumb-separator {
          margin: 0 0.5rem;
          color: #9ca3af;
        }
        
        @media (max-width: 640px) {
          .breadcrumb-nav {
            font-size: 0.8125rem;
          }
          
          .breadcrumb-separator {
            margin: 0 0.375rem;
          }
        }
      `}</style>
    </>
  );
};

export default Breadcrumb;
