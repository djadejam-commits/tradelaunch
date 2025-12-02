"use client";

import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  theme: "blue" | "red" | "green";
}

interface SiteData {
  name: string;
  subdomain: string;
  content: SiteContent;
  contact?: {
    phone: string;
    email: string;
  };
  userId: string | null;
}

const themeColors = {
  blue: "bg-blue-600",
  red: "bg-red-600",
  green: "bg-green-600",
} as const;

interface PageProps {
  params: Promise<{ siteId: string }>;
}

export default function EditorPage({ params }: PageProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [siteId, setSiteId] = useState<string | null>(null);
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Form state
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("");
  const [services, setServices] = useState<Array<{ title: string; desc: string }>>([]);
  const [aboutHeading, setAboutHeading] = useState("");
  const [aboutBody, setAboutBody] = useState("");
  const [theme, setTheme] = useState<"blue" | "red" | "green">("blue");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [regenerating, setRegenerating] = useState<"headline" | "about" | null>(null);

  // Unwrap params
  useEffect(() => {
    params.then((p) => setSiteId(p.siteId));
  }, [params]);

  // Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Real-time Firestore listener
  useEffect(() => {
    if (!siteId || !user) return;

    const unsubscribe = onSnapshot(
      doc(db, "sites", siteId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SiteData;

          // Check ownership
          if (data.userId !== user.id) {
            setUnauthorized(true);
            setLoading(false);
            return;
          }

          setSite(data);

          // Initialize form with existing data ONLY on first load
          if (data.content && !initialized) {
            setHeadline(data.content.hero.headline);
            setSubheadline(data.content.hero.subheadline);
            setCta(data.content.hero.cta);
            setServices([...data.content.services]);
            setAboutHeading(data.content.about.heading);
            setAboutBody(data.content.about.body);
            setTheme(data.content.theme);
            // Initialize contact info
            setPhone(data.contact?.phone || "");
            setEmail(data.contact?.email || "");
            // Initialize reviews
            setReviews(data.content.reviews || []);
            setInitialized(true);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching site:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [siteId, user, initialized]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!siteId) {
      console.error("No siteId available");
      return;
    }

    console.log("Saving to document:", siteId);
    setSaving(true);
    try {
      const docRef = doc(db, "sites", siteId);
      await updateDoc(docRef, {
        content: {
          hero: { headline, subheadline, cta },
          services,
          about: { heading: aboutHeading, body: aboutBody },
          reviews,
          theme,
        },
        contact: {
          phone,
          email,
        },
      });
      console.log("Successfully updated document:", siteId);
      showToast("Saved!");
    } catch (error) {
      console.error("Error saving to document:", siteId, error);
      showToast("Error saving changes");
    }
    setSaving(false);
  };

  const updateService = (index: number, field: "title" | "desc", value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const addService = () => {
    setServices([...services, { title: '', desc: '' }]);
  };

  const deleteService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    } else {
      showToast('Must have at least one service');
    }
  };

  const addReview = () => {
    setReviews([...reviews, { name: "", text: "", rating: 5 }]);
  };

  const updateReview = (index: number, field: keyof Review, value: string | number) => {
    const updated = [...reviews];
    updated[index] = { ...updated[index], [field]: value };
    setReviews(updated);
  };

  const deleteReview = (index: number) => {
    setReviews(reviews.filter((_, i) => i !== index));
  };

  const handleRegenerate = async (field: "headline" | "about") => {
    if (!siteId) return;

    setRegenerating(field);
    try {
      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ siteId, field }),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate content");
      }

      const data = await response.json();

      if (field === "headline" && data.content) {
        setHeadline(data.content.headline || headline);
        setSubheadline(data.content.subheadline || subheadline);
        setCta(data.content.cta || cta);
        showToast("Hero section regenerated!");
      } else if (field === "about" && data.content) {
        setAboutHeading(data.content.heading || aboutHeading);
        setAboutBody(data.content.body || aboutBody);
        showToast("About section regenerated!");
      }
    } catch (error) {
      console.error("Error regenerating:", error);
      showToast("Failed to regenerate content");
    }
    setRegenerating(null);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-4">You don&apos;t have permission to edit this site.</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Site Not Found</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const bgColor = themeColors[theme];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {toast}
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Back
            </Link>
            <span className="text-lg font-semibold text-gray-800">
              Editing: {site.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={
                process.env.NODE_ENV === 'production'
                  ? `https://${site.subdomain}.quickprosite.com`
                  : `http://${site.subdomain}.localhost:3000`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              View Live Site →
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Editor Form */}
        <aside className="w-96 bg-white shadow-lg h-[calc(100vh-57px)] overflow-y-auto p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Edit Content</h2>

          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Hero Section
              </h3>
              <button
                onClick={() => handleRegenerate("headline")}
                disabled={regenerating === "headline"}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 disabled:text-purple-400 px-2 py-1 rounded hover:bg-purple-50 transition"
                title="Regenerate with AI"
              >
                {regenerating === "headline" ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )}
                {regenerating === "headline" ? "Regenerating..." : "AI Regenerate"}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subheadline
                </label>
                <textarea
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Services
              </h3>
              <button
                onClick={addService}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Service
              </button>
            </div>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 relative">
                  {services.length > 1 && (
                    <button
                      onClick={() => deleteService(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                      title="Delete service"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service {index + 1} Title
                  </label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(index, "title", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={service.desc}
                    onChange={(e) => updateService(index, "desc", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                About Section
              </h3>
              <button
                onClick={() => handleRegenerate("about")}
                disabled={regenerating === "about"}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 disabled:text-purple-400 px-2 py-1 rounded hover:bg-purple-50 transition"
                title="Regenerate with AI"
              >
                {regenerating === "about" ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )}
                {regenerating === "about" ? "Regenerating..." : "AI Regenerate"}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={aboutHeading}
                  onChange={(e) => setAboutHeading(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body
                </label>
                <textarea
                  value={aboutBody}
                  onChange={(e) => setAboutBody(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Customer Reviews
              </h3>
              <button
                onClick={addReview}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Review
              </button>
            </div>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No reviews yet. Click &quot;Add Review&quot; to add one.</p>
              ) : (
                reviews.map((review, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 relative">
                    <button
                      onClick={() => deleteReview(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                      title="Delete review"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={review.name}
                        onChange={(e) => updateReview(index, "name", e.target.value)}
                        placeholder="John D."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => updateReview(index, "rating", star)}
                            className={`text-xl ${
                              star <= review.rating ? "text-yellow-400" : "text-gray-300"
                            } hover:text-yellow-400 transition`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Text
                      </label>
                      <textarea
                        value={review.text}
                        onChange={(e) => updateReview(index, "text", e.target.value)}
                        placeholder="Great service, highly recommend!"
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Theme Color
            </h3>
            <div className="flex gap-3">
              {(["blue", "red", "green"] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setTheme(color)}
                  className={`w-10 h-10 rounded-full ${themeColors[color]} ${
                    theme === color ? "ring-4 ring-offset-2 ring-gray-400" : ""
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Public Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@business.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side - Live Preview */}
        <main className="flex-1 h-[calc(100vh-57px)] overflow-y-auto">
          <div className="bg-white m-4 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-200 px-4 py-2 text-sm text-gray-500">
              Live Preview
            </div>

            {/* Preview Content */}
            <div className="min-h-[600px]">
              {/* Hero Section */}
              <section className={`${bgColor} text-white py-16 px-4`}>
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-4xl font-bold mb-4">{headline || "Your Headline"}</h1>
                  <p className="text-lg mb-6 opacity-90">{subheadline || "Your subheadline"}</p>
                  <button className="bg-white text-gray-900 font-semibold px-6 py-2 rounded-lg">
                    {cta || "Call to Action"}
                  </button>
                </div>
              </section>

              {/* Services Section */}
              <section className="py-12 px-4">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                    Our Services
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 shadow-sm"
                      >
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {service.title || `Service ${index + 1}`}
                        </h3>
                        <p className="text-gray-600 text-sm">{service.desc || "Description"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="bg-gray-100 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {aboutHeading || "About Us"}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {aboutBody || "Your about section content"}
                  </p>
                </div>
              </section>

              {/* Reviews Section */}
              {reviews.length > 0 && (
                <section className="py-12 px-4 bg-white">
                  <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                      What Our Customers Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {reviews.map((review, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                        >
                          <div className="flex mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-xl ${
                                  star <= review.rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-700 text-sm mb-4 italic">
                            &quot;{review.text}&quot;
                          </p>
                          <p className="text-gray-600 text-xs font-semibold">
                            — {review.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Footer */}
              <footer className={`${bgColor} text-white py-6 px-4`}>
                <div className="max-w-4xl mx-auto text-center">
                  <p className="opacity-90 text-sm">
                    © {new Date().getFullYear()} {site.name}. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
