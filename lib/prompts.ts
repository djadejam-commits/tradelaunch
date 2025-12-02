/**
 * Trade-specific and location-specific context for AI content generation
 */

export interface TradeContext {
  keywords: string[];
  expertise: string;
  suggestedServices: string[];
  certifications: string[];
  emergencyService?: boolean;
}

export const TRADE_CONTEXTS: Record<string, TradeContext> = {
  plumbing: {
    keywords: [
      'licensed plumber',
      'insured',
      '24/7 emergency service',
      'water heater',
      'leak repair',
      'drain cleaning',
      'pipe replacement',
      'sewer line',
    ],
    expertise: 'Licensed & insured plumbing professionals',
    suggestedServices: [
      'Emergency Leak Repair',
      'Water Heater Installation & Repair',
      'Drain Cleaning & Rooter Service',
      'Pipe Repair & Replacement',
      'Sewer Line Services',
      'Fixture Installation',
    ],
    certifications: ['Licensed', 'Bonded', 'Insured', 'Master Plumber'],
    emergencyService: true,
  },

  hvac: {
    keywords: [
      'NATE-certified',
      'EPA certified',
      'energy-efficient',
      'AC repair',
      'heating',
      'air conditioning',
      'furnace',
      'duct cleaning',
      'maintenance plan',
    ],
    expertise: 'NATE-certified HVAC technicians with EPA certification',
    suggestedServices: [
      'AC Repair & Installation',
      'Heating System Services',
      'Duct Cleaning & Sealing',
      'Preventive Maintenance Plans',
      'Energy Efficiency Audits',
      'Indoor Air Quality Solutions',
    ],
    certifications: ['NATE Certified', 'EPA Certified', 'Licensed', 'Insured'],
    emergencyService: true,
  },

  electrical: {
    keywords: [
      'licensed electrician',
      'master electrician',
      'code compliant',
      'panel upgrade',
      'surge protection',
      'electrical safety',
      'wiring',
      'circuit breaker',
    ],
    expertise: 'Licensed master electricians ensuring code-compliant installations',
    suggestedServices: [
      'Electrical Repairs & Troubleshooting',
      'Panel Upgrades & Replacements',
      'Lighting Installation & Design',
      'Safety Inspections',
      'Surge Protection',
      'EV Charger Installation',
    ],
    certifications: ['Master Electrician', 'Licensed', 'Bonded', 'Insured'],
    emergencyService: true,
  },

  landscaping: {
    keywords: [
      'landscape design',
      'lawn care',
      'irrigation',
      'hardscape',
      'tree service',
      'seasonal cleanup',
      'sustainable landscaping',
    ],
    expertise: 'Professional landscape design and maintenance specialists',
    suggestedServices: [
      'Landscape Design & Installation',
      'Lawn Maintenance & Care',
      'Irrigation System Services',
      'Hardscape Installation',
      'Tree & Shrub Care',
      'Seasonal Cleanup',
    ],
    certifications: ['Certified Landscape Professional', 'Licensed', 'Insured'],
    emergencyService: false,
  },

  roofing: {
    keywords: [
      'roof repair',
      'roof replacement',
      'licensed roofer',
      'warranty',
      'storm damage',
      'leak repair',
      'shingle replacement',
      'flat roof',
    ],
    expertise: 'Licensed roofing contractors with comprehensive warranties',
    suggestedServices: [
      'Roof Inspection & Repair',
      'Roof Replacement',
      'Storm Damage Restoration',
      'Gutter Installation & Cleaning',
      'Leak Detection & Repair',
      'Emergency Roof Services',
    ],
    certifications: ['Licensed', 'Bonded', 'Insured', 'Manufacturer Certified'],
    emergencyService: true,
  },

  'general contractor': {
    keywords: [
      'home remodeling',
      'renovation',
      'licensed contractor',
      'project management',
      'custom builds',
      'permits',
    ],
    expertise: 'Licensed general contractors managing full-scope projects',
    suggestedServices: [
      'Home Remodeling & Renovation',
      'Kitchen & Bath Upgrades',
      'Room Additions',
      'Project Management',
      'Permit Coordination',
      'Custom Building',
    ],
    certifications: ['Licensed General Contractor', 'Bonded', 'Insured'],
    emergencyService: false,
  },
};

export interface LocationContext {
  climate: string;
  marketConditions: string;
  uniqueConsiderations: string[];
}

export const LOCATION_CONTEXTS: Record<string, LocationContext> = {
  // Texas Cities
  'Austin': {
    climate: 'Hot summers (100°F+), mild winters, occasional freezes',
    marketConditions: 'Rapidly growing tech market, high demand for home services',
    uniqueConsiderations: [
      'Freeze protection for pipes critical',
      'AC systems work overtime in summer',
      'Hard water common - water treatment often needed',
      'Drought-resistant landscaping popular',
    ],
  },

  'Houston': {
    climate: 'Hot and humid, heavy rainfall, hurricane risk',
    marketConditions: 'Large metro area, diverse neighborhoods, year-round demand',
    uniqueConsiderations: [
      'High humidity strains AC systems',
      'Flood-resistant solutions important',
      'Mold and moisture control critical',
      'Hurricane preparedness valued',
    ],
  },

  'Dallas': {
    climate: 'Hot summers, mild winters, occasional ice storms',
    marketConditions: 'Major metropolitan area, strong economy, competitive market',
    uniqueConsiderations: [
      'Extreme heat puts pressure on AC',
      'Ice storms require winterization',
      'Hard water issues common',
      'Energy efficiency highly valued',
    ],
  },

  // Arizona
  'Phoenix': {
    climate: 'Extreme heat (110°F+ in summer), very low humidity, mild winters',
    marketConditions: 'Retiree population, new construction, AC-dependent',
    uniqueConsiderations: [
      'AC is absolutely critical - not optional',
      'Hard water and mineral buildup severe',
      'Desert landscaping and xeriscaping standard',
      'Pool maintenance common need',
    ],
  },

  // California
  'Los Angeles': {
    climate: 'Mediterranean - mild year-round, minimal rainfall',
    marketConditions: 'High property values, quality expectations, eco-conscious',
    uniqueConsiderations: [
      'Water conservation critical',
      'Earthquake-safe installations required',
      'Solar integration popular',
      'Green building practices expected',
    ],
  },

  'San Francisco': {
    climate: 'Cool summers, mild winters, fog common',
    marketConditions: 'High costs, quality-focused, tech-savvy clientele',
    uniqueConsiderations: [
      'Heating more critical than AC',
      'Seismic safety paramount',
      'Historic building constraints',
      'Sustainability highly valued',
    ],
  },

  // Other Major Cities
  'Chicago': {
    climate: 'Cold winters (-10°F common), hot humid summers',
    marketConditions: 'Old housing stock, four-season demands, union labor',
    uniqueConsiderations: [
      'Freeze protection absolutely critical',
      'Furnace maintenance essential',
      'Old pipes and infrastructure common',
      'Snow and ice preparedness needed',
    ],
  },

  'Miami': {
    climate: 'Hot and humid year-round, hurricane season',
    marketConditions: 'Coastal issues, tourism impact, multilingual needs',
    uniqueConsiderations: [
      'Hurricane-rated equipment standard',
      'Salt air corrosion a factor',
      'AC runs year-round',
      'Flood resistance critical',
    ],
  },

  'Seattle': {
    climate: 'Mild and rainy, cool summers, rarely freezes',
    marketConditions: 'Eco-conscious, high-tech population, quality expectations',
    uniqueConsiderations: [
      'Moisture and mold prevention key',
      'Green solutions popular',
      'AC less common but growing',
      'Rain management systems important',
    ],
  },

  'Denver': {
    climate: 'Four seasons, dry climate, significant temp swings',
    marketConditions: 'Growing market, outdoor lifestyle, quality-focused',
    uniqueConsiderations: [
      'Altitude affects HVAC sizing',
      'Freeze protection needed',
      'Dry climate affects materials',
      'Energy efficiency valued',
    ],
  },
};

/**
 * Get trade context or return a generic fallback
 */
export function getTradeContext(trade: string): TradeContext {
  const normalizedTrade = trade.toLowerCase();
  return TRADE_CONTEXTS[normalizedTrade] || {
    keywords: ['professional service', 'licensed', 'insured'],
    expertise: `Licensed ${trade} professionals`,
    suggestedServices: [
      `${trade} Services`,
      `${trade} Repairs`,
      `${trade} Installation`,
    ],
    certifications: ['Licensed', 'Insured'],
    emergencyService: false,
  };
}

/**
 * Get location context or return a generic fallback
 */
export function getLocationContext(city: string): LocationContext | null {
  // Try exact match first
  if (LOCATION_CONTEXTS[city]) {
    return LOCATION_CONTEXTS[city];
  }

  // Try to extract city name from "City, State" format
  const cityName = city.split(',')[0].trim();
  return LOCATION_CONTEXTS[cityName] || null;
}

/**
 * Build enhanced AI prompt with trade and location context
 */
export function buildEnhancedPrompt(params: {
  businessName: string;
  city: string;
  trade: string;
  googleData?: {
    rating?: number;
    userRatingTotal?: number;
    reviews: Array<{ author: string; text: string; rating: number }>;
  };
}): { systemPrompt: string; userPrompt: string } {
  const { businessName, city, trade, googleData } = params;

  const tradeContext = getTradeContext(trade);
  const locationContext = getLocationContext(city);

  const systemPrompt = `You are an expert copywriter specializing in ${trade} businesses. Output valid JSON only. Create compelling, specific content that reflects the business's actual reputation, industry standards, and local market conditions.`;

  // Build Google Business context
  let googleContext = '';
  if (googleData && googleData.reviews && googleData.reviews.length > 0) {
    const topReview = googleData.reviews[0];
    googleContext = `
REAL BUSINESS DATA (use this to make content credible):
- Google Rating: ${googleData.rating}/5 from ${googleData.userRatingTotal} reviews
- Top customer review: "${topReview.text.slice(0, 200)}..."
- Customer: ${topReview.author}
- This is an established business with proven track record
`;
  }

  // Build trade-specific context
  const tradeSpecificContext = `
TRADE-SPECIFIC CONTEXT (${trade}):
- Key terminology to use: ${tradeContext.keywords.join(', ')}
- Expertise level: ${tradeContext.expertise}
- Typical certifications: ${tradeContext.certifications.join(', ')}
${tradeContext.emergencyService ? '- Emphasize 24/7 emergency availability' : ''}
- Service examples: ${tradeContext.suggestedServices.slice(0, 3).join(', ')}
`;

  // Build location-specific context
  let locationSpecificContext = '';
  if (locationContext) {
    locationSpecificContext = `
LOCATION-SPECIFIC CONTEXT (${city}):
- Climate: ${locationContext.climate}
- Market: ${locationContext.marketConditions}
- Key considerations:
${locationContext.uniqueConsiderations.map(c => `  • ${c}`).join('\n')}
`;
  }

  const userPrompt = `Generate professional website content for ${businessName} in ${city}.
${googleContext}${tradeSpecificContext}${locationSpecificContext}
Output must follow this exact JSON schema:
{
  "hero": { "headline": "string", "subheadline": "string", "cta": "string" },
  "services": [{ "title": "string", "desc": "string" }],
  "about": { "heading": "string", "body": "string" },
  "theme": "blue" | "red" | "green"
}

CONTENT REQUIREMENTS:
- Hero headline: Action-oriented, location-specific, mentions ${city}
  ${googleData ? `• Hint at their ${googleData.rating}/5 star reputation if appropriate` : ''}
  • Should be compelling but not hyperbolic

- Subheadline: Emphasize local expertise and trade-specific value
  ${tradeContext.emergencyService ? '• Mention 24/7 emergency service if applicable' : ''}
  • Reference years of experience or customer satisfaction

- Services: Exactly 3 services using trade-specific terminology
  • Use industry-standard service names from: ${tradeContext.suggestedServices.join(', ')}
  • Each service should have specific, benefit-focused description (2-3 sentences)
  • Tie services to local needs where possible

- About section:
  • Mention commitment to ${city} community
  • Reference certifications: ${tradeContext.certifications.join(', ')}
  ${googleData ? `• Acknowledge customer satisfaction (based on ${googleData.rating}/5 stars)` : ''}
  ${locationContext ? `• Address local considerations (e.g., ${locationContext.uniqueConsiderations[0]})` : ''}
  • Professional but approachable tone
  • 3-4 sentences

- Theme: Choose based on trade association
  • Blue: Water, cooling, cleaning trades (plumbing, pool service, HVAC cooling)
  • Red: Heat, electrical, urgent trades (heating, electrical, emergency services)
  • Green: Outdoor, eco, landscape trades (landscaping, solar, tree service)

- All text should be professional, specific, and locally relevant`;

  return { systemPrompt, userPrompt };
}
