export const revalidate = 0;

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import StickyFooter from '@/components/StickyFooter';
import LeadForm from '@/components/LeadForm';

interface PageProps {
  params: Promise<{ subdomain: string }>;
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
  theme: 'blue' | 'red' | 'green';
}

interface SiteData {
  id: string;
  name: string;
  subdomain: string;
  contact?: {
    phone: string;
    email: string;
  };
  content?: SiteContent;
}

const themeColors = {
  blue: 'bg-blue-600',
  red: 'bg-red-600',
  green: 'bg-green-600',
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

export default async function RendererPage({ params }: PageProps) {
  const { subdomain } = await params;
  const site = await getSiteBySubdomain(subdomain);

  if (!site) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">404: Site Not Found</h1>
      </main>
    );
  }

  // Fallback for old data without content
  if (!site.content) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">{site.name}</h1>
        <p className="text-xl text-gray-500 mt-4">Under Construction</p>
      </main>
    );
  }

  const { hero, services, about, theme } = site.content;
  const bgColor = themeColors[theme] || themeColors.blue;
  const phone = site.contact?.phone || '';
  const email = site.contact?.email || '';

  return (
    <main className="min-h-screen pb-16 md:pb-0">
      {/* Hero Section */}
      <section className={`${bgColor} text-white py-24 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">{hero.headline}</h1>
          <p className="text-xl mb-8 opacity-90">{hero.subheadline}</p>

          {/* Phone Number Display */}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-block mb-6 text-lg font-medium hover:underline"
            >
              📞 {phone}
            </a>
          )}

          <div>
            <a
              href="#lead-form"
              className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {hero.cta}
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{about.heading}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{about.body}</p>
        </div>
      </section>

      {/* Lead Form */}
      <LeadForm siteId={site.id} />

      {/* Footer */}
      <footer className={`${bgColor} text-white py-8 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          {phone && (
            <p className="mb-2">
              <a href={`tel:${phone}`} className="hover:underline">📞 {phone}</a>
            </p>
          )}
          {email && (
            <p className="mb-4">
              <a href={`mailto:${email}`} className="hover:underline">✉️ {email}</a>
            </p>
          )}
          <p className="opacity-90">&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky Mobile Footer */}
      <StickyFooter phone={phone} />
    </main>
  );
}
