import { env } from '@/lib/env';
import { getCityDataFromUrl } from '@/lib/cityData';
import { getCanonicalUrl } from '@/lib/canonical-helper';

type ServiceType = 'Économique' | 'Standard' | 'Premium';

interface ServiceJsonLdProps {
  serviceType: ServiceType;
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
}

export default function ServiceJsonLd({ serviceType, faqItems }: ServiceJsonLdProps) {
  const city = getCityDataFromUrl(env.SITE_URL);
  const serviceSlug = `demenagement-${serviceType.toLowerCase()}-${city.slug}`;
  const serviceName = `Déménagement ${serviceType} ${city.nameCapitalized}`;
  const serviceUrl = getCanonicalUrl(`services/${serviceSlug}`);

  const priceRange = serviceType === 'Économique' ? '€' : serviceType === 'Standard' ? '€€' : '€€€';

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${serviceUrl}#service`,
    name: serviceName,
    serviceType: `Déménagement ${serviceType}`,
    description: `Service de déménagement ${serviceType.toLowerCase()} à ${city.nameCapitalized}. Devis gratuit, déménageurs vérifiés.`,
    provider: {
      '@type': 'Organization',
      '@id': `${city.siteUrl}/#organization`,
    },
    areaServed: [
      {
        '@type': 'City',
        name: city.nameCapitalized,
      },
    ],
    url: serviceUrl,
    priceRange,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${serviceUrl}#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}

