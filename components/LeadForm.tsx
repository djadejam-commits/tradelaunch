"use client";

import { useState, FormEvent } from "react";

interface LeadFormProps {
  siteId: string;
}

export default function LeadForm({ siteId }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      setError("Please fill in your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId,
          name,
          phone,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit lead");
      }

      setIsSuccess(true);
      setName("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.error("Error submitting lead:", err);
      setError("Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div id="lead-form" className="bg-gray-100 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600">
            We&apos;ve received your message and will get back to you shortly.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-6 text-blue-600 hover:text-blue-700 font-medium"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="lead-form" className="bg-gray-100 py-16 px-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Get a Free Quote
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              id="lead-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="lead-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="lead-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="lead-message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="lead-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your project..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Sending..." : "Request Quote"}
          </button>
        </form>
      </div>
    </div>
  );
}
