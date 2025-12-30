import { Helmet } from 'react-helmet';

export function SchemaMarkup() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is restaurant labor cost percentage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Labor cost percentage is a metric that shows the portion of your gross sales that goes towards paying your employees. It is calculated by dividing total labor costs by total revenue and multiplying by 100."
        }
      },
      {
        "@type": "Question",
        "name": "What costs should be included in labor cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Total labor cost should include hourly wages, salaried wages, overtime pay, payroll taxes, benefits (healthcare, insurance), bonuses, paid time off, and potentially employee meals."
        }
      },
      {
        "@type": "Question",
        "name": "What is a good labor cost percentage for a restaurant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Generally, a healthy restaurant labor cost percentage falls between 25% and 35%. However, this varies by concept: Quick Service (20-25%), Casual Dining (25-30%), and Fine Dining (30-35%)."
        }
      }
    ]
  };

  return (
    <Helmet>
      <title>Restaurant Labor Cost Calculator (Labor % & Benchmarks)</title>
      <meta name="description" content="Calculate your restaurant labor cost percentage instantly and compare it to typical benchmarks for quick service, casual dining, and fine dining. Includes wages, taxes, benefits, overtime, bonuses, and PTO." />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Restaurant Labor Cost Calculator (Labor % & Benchmarks)" />
      <meta property="og:description" content="Calculate your restaurant labor cost percentage instantly and compare it to typical benchmarks by restaurant type." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Restaurant Labor Cost Calculator (Labor % & Benchmarks)" />
      <meta name="twitter:description" content="Calculate restaurant labor cost % and compare against benchmarks for quick service, casual dining, and fine dining." />
      <script type="application/ld+json">
        {JSON.stringify(faqData)}
      </script>
    </Helmet>
  );
}
