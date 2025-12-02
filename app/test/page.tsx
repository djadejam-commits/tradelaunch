"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function TestPage() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 gradient-text">
          QuickProSite Component Library
        </h1>
        <p className="text-slate-400 mb-12">
          Testing the new Button and Input components with all variants
        </p>

        {/* Input Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-100 mb-8">Input Components</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Input */}
            <Input
              label="Business Name"
              placeholder="Joe's Plumbing"
            />

            {/* Input with Glow */}
            <Input
              label="City (with glow effect)"
              placeholder="Austin, TX"
              glow
            />

            {/* Input with Leading Icon */}
            <Input
              label="Search"
              placeholder="Search for your business..."
              leadingIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              glow
            />

            {/* Input with Trailing Icon */}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              trailingIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* Input with Error */}
            <Input
              label="Phone Number"
              placeholder="(555) 123-4567"
              error="Please enter a valid phone number"
            />

            {/* Input with Helper Text */}
            <Input
              label="Website"
              placeholder="https://example.com"
              helperText="Your website URL (optional)"
            />

            {/* Disabled Input */}
            <Input
              label="Read Only Field"
              value="This field is disabled"
              disabled
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              glow
            />
          </div>

          {/* Mad Libs Style Demo */}
          <div className="mt-12 p-8 glass rounded-2xl">
            <h3 className="text-xl font-bold text-slate-100 mb-6">Mad Libs Style (Landing Page)</h3>
            <div className="flex flex-wrap items-center gap-3 text-2xl text-slate-300">
              <span>I'm a</span>
              <Input
                placeholder="Plumber"
                className="inline-block min-w-[200px]"
                glow
              />
              <span>in</span>
              <Input
                placeholder="Austin, TX"
                className="inline-block min-w-[200px]"
                glow
              />
            </div>
          </div>
        </section>

        <div className="border-t border-slate-800 my-12"></div>

        {/* Card Components */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-100 mb-8">Card Components</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Card */}
            <Card>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Default Card</h3>
              <p className="text-slate-400">
                Standard card with slate background and border. Perfect for content sections.
              </p>
            </Card>

            {/* Glass Card */}
            <Card variant="glass">
              <h3 className="text-xl font-bold text-slate-100 mb-2">Glass Card</h3>
              <p className="text-slate-400">
                Glassmorphic style with backdrop blur. Creates depth and modern aesthetic.
              </p>
            </Card>

            {/* Elevated Card */}
            <Card variant="elevated">
              <h3 className="text-xl font-bold text-slate-100 mb-2">Elevated Card</h3>
              <p className="text-slate-400">
                Card with shadow elevation. Adds visual hierarchy to important content.
              </p>
            </Card>

            {/* Card with Hover */}
            <Card hover>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Hover Effect</h3>
              <p className="text-slate-400">
                Scales up and changes border on hover. Great for clickable cards.
              </p>
            </Card>

            {/* Card with Glow */}
            <Card variant="glass" hover glow>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Glass + Glow</h3>
              <p className="text-slate-400">
                Combination of glass and cyan glow effect. Premium interactive feel.
              </p>
            </Card>

            {/* Compact Card */}
            <Card variant="glass" padding="sm">
              <h3 className="text-lg font-bold text-slate-100 mb-1">Compact</h3>
              <p className="text-sm text-slate-400">Small padding variant</p>
            </Card>

            {/* Large Padding Card */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Spacious Card</h3>
              <p className="text-slate-400">Large padding for prominent content areas.</p>
            </Card>

            {/* No Padding Card */}
            <Card padding="none" className="overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-cyan-500 to-purple-600"></div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-slate-100 mb-2">Image Card</h3>
                <p className="text-slate-400 text-sm">
                  No padding variant for custom layouts with images.
                </p>
              </div>
            </Card>
          </div>

          {/* Dashboard Bento Grid Demo */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-100 mb-6">Bento Grid Layout (Dashboard Preview)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="glass" hover glow className="md:col-span-2 md:row-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-100">Recent Sites</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="font-medium text-slate-200">joesplumbing.com</p>
                    <p className="text-sm text-slate-400 mt-1">Last updated 2 hours ago</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="font-medium text-slate-200">cityelectrical.com</p>
                    <p className="text-sm text-slate-400 mt-1">Last updated 1 day ago</p>
                  </div>
                </div>
              </Card>

              <Card variant="glass" hover>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Total Sites</h3>
                <p className="text-4xl font-bold gradient-text">12</p>
                <p className="text-sm text-slate-400 mt-2">+3 this month</p>
              </Card>

              <Card variant="glass" hover>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Active</h3>
                <p className="text-4xl font-bold text-green-400">8</p>
                <p className="text-sm text-slate-400 mt-2">Live sites</p>
              </Card>

              <Card variant="elevated" hover glow className="md:col-span-1">
                <h3 className="text-lg font-bold text-slate-100 mb-3">Quick Actions</h3>
                <Button variant="primary" size="sm" fullWidth icon={<span>✨</span>}>
                  New Site
                </Button>
              </Card>
            </div>
          </div>
        </section>

        <div className="border-t border-slate-800 my-12"></div>

        {/* Primary Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Primary Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="sm">
              Small Button
            </Button>
            <Button variant="primary" size="md">
              Medium Button
            </Button>
            <Button variant="primary" size="lg">
              Generate My Site ✨
            </Button>
            <Button variant="primary" loading>
              Loading State
            </Button>
          </div>
        </section>

        {/* Secondary Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Secondary Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" size="sm">
              Edit
            </Button>
            <Button variant="secondary" size="md">
              View Details
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </section>

        {/* Ghost Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Ghost Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
            <Button variant="ghost" size="md">
              Skip for now
            </Button>
            <Button variant="ghost" size="lg">
              Back to Home
            </Button>
          </div>
        </section>

        {/* Danger Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Danger Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="danger" size="sm">
              Delete
            </Button>
            <Button variant="danger" size="md">
              Remove Site
            </Button>
            <Button variant="danger" size="lg">
              Permanently Delete
            </Button>
          </div>
        </section>

        {/* Full Width */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Full Width</h2>
          <Button variant="primary" size="lg" fullWidth>
            Full Width Primary Button
          </Button>
        </section>

        {/* Interactive Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Interactive Demo</h2>
          <Button variant="primary" size="lg" onClick={handleClick} loading={loading}>
            Click to Test Loading State
          </Button>
        </section>

        {/* With Icons (simulated with emojis) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">With Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" icon={<span>✨</span>}>
              Generate Site
            </Button>
            <Button variant="secondary" icon={<span>✏️</span>}>
              Edit
            </Button>
            <Button variant="ghost" icon={<span>←</span>}>
              Back
            </Button>
          </div>
        </section>

        {/* Disabled States */}
        <section>
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Disabled States</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" disabled>
              Disabled Primary
            </Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
            <Button variant="danger" disabled>
              Disabled Danger
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
