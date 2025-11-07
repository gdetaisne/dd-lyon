'use client';

import { usePathname } from 'next/navigation';
import { env } from '@/lib/env';
import { getCityDataFromUrl } from '@/lib/cityData';
import { getCanonicalUrl } from '@/lib/canonical-helper';

export default function AllStructuredData() {
  const pathname = usePathname();
  const city = getCityDataFromUrl(env.SITE_URL);

  // 1. Organization + LocalBusiness (toutes pages)
  const graph: any[] = [
    {
      '@type': 'Organization',
      '@id': `${city.siteUrl}/#organization`,
      name: `Déménageurs ${city.nameCapitalized} (IA)`,
      url: city.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${city.siteUrl}/icons/android-chrome-512x512.png`,
        width: 512,
        height: 512,
      },
      description:
        'Comparateur de devis déménagement avec estimation IA par photos. Service gratuit, 5 devis personnalisés sous 7 jours.',
      sameAs: [],
      searchIntent: 'transactional',
      email: `contact@${new URL(city.siteUrl).hostname}`,
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${city.siteUrl}/#localbusiness`,
      name: `Déménageurs ${city.nameCapitalized} (IA)`,
      description:
        '30 minutes pour votre dossier → 5 devis personnalisés sous 7 jours. Estimation volumétrique à partir de photos, tarifs clairs, conseils locaux.',
      url: city.siteUrl,
      email: `contact@${new URL(city.siteUrl).hostname}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city.nameCapitalized,
        addressRegion: city.region,
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: city.coordinates.latitude,
        longitude: city.coordinates.longitude,
      },
      areaServed: city.areaServed.map((area) => ({
        '@type': 'City',
        name: area,
      })),
      priceRange: '€€',
    },
  ];

  // 2. HowTo (homepage uniquement)
  if (pathname === '/') {
    graph.push({
      '@type': 'HowTo',
      name: `Comment obtenir 5 devis de déménagement à ${city.nameCapitalized}`,
      description:
        'Guide étape par étape pour recevoir des devis de déménagement gratuits et comparables.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Prenez des photos de vos pièces',
          text: '3 à 5 photos par pièce suffisent',
          image: `${city.siteUrl}/images/how-it-works/step-1-photos.jpg`,
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: "L'IA calcule votre volume",
          text: 'Estimation fiable en 2 minutes',
          image: `${city.siteUrl}/images/how-it-works/step-2-estimation.jpg`,
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Recevez 5 devis gratuits',
          text: 'Sous 7 jours, directement comparables',
          image: `${city.siteUrl}/images/how-it-works/step-3-loading.jpg`,
        },
      ],
    });
  }

  // 3. Service + FAQ (pages /services/demenagement-*)
  if (pathname?.startsWith('/services/demenagement-')) {
    const serviceType = pathname.includes('economique')
      ? 'Économique'
      : pathname.includes('standard')
      ? 'Standard'
      : pathname.includes('premium')
      ? 'Premium'
      : 'Standard';

    const serviceName = `Déménagement ${serviceType} ${city.nameCapitalized}`;
    const serviceUrl = getCanonicalUrl(pathname.slice(1)); // Remove leading /

    // Service schema
    graph.push({
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
      priceRange: '€€',
    });

    // FAQ schema (exemple générique, tu peux raffiner selon la formule)
    const faqItems =
      serviceType === 'Économique'
        ? [
            {
              question: 'Que dois-je faire moi-même ?',
              answer:
                "Vous devez emballer tous vos biens dans des cartons (fournis), démonter les meubles simples. L'équipe se charge du transport, démontage complexe, et remontage.",
            },
            {
              question: 'Puis-je ajouter des services ?',
              answer:
                "Oui, vous pouvez ajouter emballage pro, protection meubles fragiles, ou monte-meuble. Ces options sont facturées en plus. Pour un service tout inclus, voyez la formule standard.",
            },
          ]
        : serviceType === 'Standard'
        ? [
            {
              question: "Est-ce que l'emballage est fourni ?",
              answer:
                'Oui, les cartons standard sont inclus dans la formule. Nous fournissons tous les cartons nécessaires pour emballer vos affaires. Pour les objets très fragiles, nous recommandons la formule premium.',
            },
            {
              question: 'Puis-je ajouter un service "fragile" ?',
              answer:
                "Oui, vous pouvez ajouter des services à la carte comme l'emballage d'objets très fragiles. Ces options sont facturées en supplément. Pour un service complet, nous recommandons la formule premium.",
            },
          ]
        : [
            {
              question: 'Que comprend la formule premium ?',
              answer:
                'La formule premium inclut : emballage complet par nos équipes (y compris objets fragiles avec matériel spécialisé), démontage/remontage de tous meubles, protection intégrale, assurance tous risques renforcée, nettoyage basique du logement.',
            },
            {
              question: 'Puis-je personnaliser la formule ?',
              answer:
                "Oui, vous pouvez ajouter des options comme stockage temporaire, garde-meuble, installation électroménager, conciergerie (changement d'adresse, EDFs). Contactez-nous pour un devis sur-mesure.",
            },
          ];

    graph.push({
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
    });
  }

  // 4. Article (pages /blog/[category]/[slug])
  // NOTE: Pour blog, il faudra récupérer les metadatas du post (title, description, image, dates)
  // Pour l'instant, on skip car ça nécessite d'accéder aux données du post
  // Tu pourras ajouter ça après, en passant les props depuis page.tsx

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

