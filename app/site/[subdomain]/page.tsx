export const revalidate = 0;

import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import StickyFooter from '@/components/StickyFooter';
import LeadForm from '@/components/LeadForm';

interface PageProps {
  params: Promise<{ subdomain: string }>;
}

interface Review {
  name: string;
  text: string;
  rating: number;
}

interface SiteContent {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  services: Array<{
    title: string;
    desc: string;
  }>;
  about: {
    heading: string;
    body: string;
  };
  reviews?: Review[];
  theme: 'blue' | 'red' | 'green';
}

interface SiteData {
  id: string;
  name: string;
  subdomain: string;
  city?: string;
  trade?: string;
  contact?: {
    phone: string;
    email: string;
  };
  content?: SiteContent;
}

const themeGradients = {
  blue: 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700',
  red: 'bg-gradient-to-br from-red-900 via-red-800 to-red-700',
  green: 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700',
} as const;

const themeBorderColors = {
  blue: 'border-blue-500',
  red: 'border-red-500',
  green: 'border-emerald-500',
} as const;

async function getSiteBySubdomain(subdomain: string): Promise<SiteData | null> {
  const sitesRef = collection(db, 'sites');
  const q = query(sitesRef, where('subdomain', '==', subdomain));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as SiteData;
}

// SEO Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subdomain } = await params;
  const site = await getSiteBySubdomain(subdomain);

  // Handle 404 gracefully
  if (!site || !site.content) {
    return {
      title: 'Site Not Found',
      description: 'The requested site could not be found.',
    };
  }

  const { name, city, trade, content, contact } = site;
  const phone = contact?.phone || '';

  // Build SEO title: "{Business Name} | {City} {Trade}"
  let title = name;
  if (city && trade) {
    title = `${name} | ${city} ${trade}`;
  } else if (city) {
    title = `${name} | ${city}`;
  } else if (trade) {
    title = `${name} | ${trade}`;
  }

  // Build description: "{Hero Subheadline} - Call us at {Phone}"
  let description = content.hero.subheadline;
  if (phone) {
    description = `${content.hero.subheadline} - Call us at ${phone}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function RendererPage({ params }: PageProps) {
  const { subdomain } = await params;
  const site = await getSiteBySubdomain(subdomain);

  if (!site) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center" suppressHydrationWarning>
        <h1 className="text-4xl font-bold">404: Site Not Found</h1>
      </main>
    );
  }

  // Fallback for old data without content
  if (!site.content) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100" suppressHydrationWarning>
        <h1 className="text-4xl font-bold text-gray-800">{site.name}</h1>
        <p className="text-xl text-gray-500 mt-4">Under Construction</p>
      </main>
    );
  }

  const { hero, services, about, reviews, theme } = site.content;
  const bgGradient = themeGradients[theme] || themeGradients.blue;
  const borderColor = themeBorderColors[theme] || themeBorderColors.blue;
  const phone = site.contact?.phone || '';
  const email = site.contact?.email || '';
  const hasReviews = reviews && reviews.length > 0;

  return (
    <main className="min-h-screen pb-20 md:pb-0" suppressHydrationWarning>
      {/* Hero Section */}
      <section className={`${bgGradient} text-white py-28 px-4 relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-lg">
            {hero.headline}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            {hero.subheadline}
          </p>

          {/* Phone Number Display */}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 mb-8 text-lg font-medium bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phone}
            </a>
          )}

          <div>
            <a
              href="#lead-form"
              className="inline-block bg-white text-gray-900 font-bold px-10 py-4 rounded-xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20 text-lg"
            >
              {hero.cta}
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-gray-900">Our Services</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">Expert solutions tailored to your needs</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 ${borderColor} hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 ${bgGradient} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-white text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-gray-900">{about.heading}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{about.body}</p>
        </div>
      </section>

      {/* Testimonials Section */}
      {hasReviews && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Don&apos;t just take our word for it - hear from our satisfied customers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews!.map((review, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {/* Review Text */}
                  <p className="text-gray-600 leading-relaxed mb-4 italic">
                    &quot;{review.text}&quot;
                  </p>
                  {/* Reviewer Name */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${bgGradient} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">{review.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Form */}
      <LeadForm siteId={site.id} />

      {/* Footer */}
      <footer className={`${bgGradient} text-white py-12 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">{site.name}</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {phone && (
              <a href={`tel:${phone}`} className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {email}
              </a>
            )}
          </div>
          <p className="opacity-70 text-sm">&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky Mobile Footer */}
      <StickyFooter phone={phone} />
    </main>
  );
}
