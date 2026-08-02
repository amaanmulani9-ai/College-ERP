import React, { useEffect } from "react";

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl = "https://college-erp.cloud",
  ogType = "website",
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = `${title} | College ERP SaaS Platform`;

    // 2. Helper to set/update Meta tags
    const setMeta = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 3. Set Description & OpenGraph / Twitter tags
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    // 4. Update Canonical Link
    let canonical = document.querySelector(`link[rel="canonical"]`);
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // 5. Inject Structured Data JSON-LD
    let ldScript = document.querySelector(`script[type="application/ld+json"]`);
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "College ERP SaaS Platform",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web, Cloud",
      "offers": {
        "@type": "Offer",
        "price": "249.00",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "125"
      }
    });

  }, [title, description, canonicalUrl, ogType]);

  return null;
};
