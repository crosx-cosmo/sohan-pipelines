export const siteConfig = {
  name: 'SOHAN PIPELINES',
  shortName: 'SOHAN',
  tagline: 'Premium Plumbing Solutions Since 2009',
  phone: '8670143003',
  phoneHref: 'tel:8670143003',
  whatsapp: '8670143003',
  whatsappHref: 'https://wa.me/918670143003',
  email: 'contact@sohanpipelines.in',
  emailHref: 'mailto:contact@sohanpipelines.in',
  address: {
    street: 'Bahardaltitia, Keshrambha',
    city: 'Paschim Medinipur',
    state: 'West Bengal',
    zip: '721451',
  },
  hours: {
    weekdays: '8:00 AM – 8:00 PM',
    saturday: '10:00 AM – 5:00 PM',
    sunday: 'Emergency Only',
    emergency: '24/7 Emergency Service Available',
  },
  social: {
    facebook: 'https://facebook.com/sohanpipelines',
    instagram: 'https://instagram.com/sohanpipelines',
    twitter: 'https://twitter.com/sohanpipelines',
    youtube: 'https://youtube.com/@sohanpipelines',
  },
  license: 'Licensed Plumbing Contractor — MPCB Certified',
  insurance: 'Fully Licensed & Insured',
  rating: 4.9,
  reviewCount: 2150,
  yearsInBusiness: 15,
  jobsCompleted: 24000,
  responseTime: '45 min average response',
  serviceAreaCount: 100,
  url: 'https://www.sohanpipelines.com',
};

export type ServiceDetail = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: string;
  tagline: string;
  summary: string;
  description: string;
  features: string[];
  process: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  imageQuery: string;
  priceFrom: string;
};

export const services: ServiceDetail[] = [
  {
    slug: 'emergency-plumbing',
    title: '24/7 Emergency Plumbing',
    shortTitle: 'Emergency Plumbing',
    icon: 'Siren',
    tagline: 'Fast response when it matters most',
    summary:
      'Burst pipes, major leaks, sewage backups — our certified emergency plumbers are on call 24 hours a day, 365 days a year.',
    description:
      'Plumbing emergencies do not wait for business hours, and neither do we. Our rapid-response team is dispatched immediately to minimize water damage and restore your system. We arrive in fully stocked service vehicles equipped to handle most emergencies on the spot, from burst pipe repair to sewer line clearing.',
    features: [
      '45-minute average response time',
      'Live dispatcher 24/7/365 — never an answering service',
      'Fully stocked emergency vehicles',
      'Water damage mitigation assistance',
      'Upfront pricing before any work begins',
      'Insurance documentation provided',
    ],
    process: [
      {
        title: 'Call Dispatched',
        description:
          'A live dispatcher takes your call, assesses the urgency, and routes the nearest available technician.',
      },
      {
        title: 'Rapid Arrival',
        description:
          'Your plumber arrives in a fully stocked vehicle, typically within 45 minutes of your call.',
      },
      {
        title: 'Diagnose & Quote',
        description:
          'We identify the problem, explain your options, and provide upfront pricing before any work starts.',
      },
      {
        title: 'Repair & Cleanup',
        description:
          'The repair is completed efficiently, the area is cleaned, and we verify everything works correctly.',
      },
    ],
    faqs: [
      {
        question: 'Do you charge extra for emergency or after-hours calls?',
        answer:
          'We are transparent about our emergency service rates. A modest after-hours fee applies, and you will always know the total cost before we begin any work.',
      },
      {
        question: 'What counts as a plumbing emergency?',
        answer:
          'Burst pipes, major leaks, sewage backups, overflowing toilets, no water, and gas line issues all qualify. If you are unsure, call us and we will help you assess.',
      },
      {
        question: 'How quickly can you get here?',
        answer:
          'Our average response time is 45 minutes within our primary service area. During extreme weather, times may vary slightly, but dispatch will give you an accurate ETA on the call.',
      },
    ],
    imageQuery: 'plumber fixing pipe under sink',
    priceFrom: '₹499 service call',
  },
  {
    slug: 'water-heater-repair',
    title: 'Water Heater Repair & Installation',
    shortTitle: 'Water Heaters',
    icon: 'Flame',
    tagline: 'Hot water restored, fast',
    summary:
      'Tank, tankless, or hybrid — we repair, replace, and install all major water heater brands with same-day service.',
    description:
      'No hot water? Strange rumbling sounds? Leaking tank? Our water heater specialists diagnose and fix the problem quickly. We install traditional tank heaters, high-efficiency tankless systems, and heat pump hybrid units — all backed by manufacturer warranties and our own workmanship guarantee.',
    features: [
      'Same-day repair on most water heater issues',
      'Tankless water heater installation and conversion',
      'All major brands serviced: Racold, Bajaj, AO Smith, Havells',
      'Energy efficiency consultations',
      'Complete installation with safety compliance',
      '5-year workmanship warranty on installations',
    ],
    process: [
      {
        title: 'Assessment',
        description:
          'We inspect your current unit, diagnose the issue, and recommend repair or replacement based on age and condition.',
      },
      {
        title: 'Options & Pricing',
        description:
          'You receive clear options with upfront pricing — repair cost vs. replacement cost with long-term savings analysis.',
      },
      {
        title: 'Installation',
        description:
          'Our team safely removes the old unit, installs the new one, and ensures full safety compliance.',
      },
      {
        title: 'Testing & Walkthrough',
        description:
          'We test the system, show you how to operate it, and provide maintenance tips to extend its lifespan.',
      },
    ],
    faqs: [
      {
        question: 'How long do water heaters typically last?',
        answer:
          'Traditional tank water heaters last 8-12 years, while tankless units can last 15+ years with proper maintenance. If yours is approaching the end of its lifespan, we will help you plan a replacement before it fails.',
      },
      {
        question: 'Is a tankless water heater worth it?',
        answer:
          'Tankless systems cost more upfront but save 30-50% on energy costs, provide endless hot water, and last nearly twice as long. We will calculate your break-even point during the consultation.',
      },
      {
        question: 'Can you convert my tank system to tankless?',
        answer:
          'Yes. We handle full tank-to-tankless conversions including gas line upgrades, venting, and electrical work. Most conversions are completed in a single day.',
      },
    ],
    imageQuery: 'water heater installation plumber',
    priceFrom: '₹699 repair',
  },
  {
    slug: 'drain-cleaning',
    title: 'Drain Cleaning & Unclogging',
    shortTitle: 'Drain Cleaning',
    icon: 'Waves',
    tagline: 'Clear pipes, free-flowing drains',
    summary:
      'From slow drains to severe blockages, we use professional hydro-jetting and camera inspection to clear and diagnose any drain issue.',
    description:
      'Store-bought chemicals rarely solve the root cause and can damage your pipes. Our professional drain cleaning service uses hydro-jetting technology to blast away grease, scale, and debris, followed by a camera inspection to verify the line is fully clear and identify any underlying issues.',
    features: [
      'Hydro-jetting for thorough pipe cleaning',
      'Video camera pipe inspection',
      'Kitchen, bathroom, and main line cleaning',
      'Tree root removal from sewer lines',
      'Preventative maintenance plans',
      'No-dig trenchless repair options',
    ],
    process: [
      {
        title: 'Inspection',
        description:
          'We use a waterproof camera to inspect the inside of your pipes and identify the exact location and cause of the blockage.',
      },
      {
        title: 'Clearing',
        description:
          'Depending on the blockage, we use drain snakes or hydro-jetting to restore full flow through the affected line.',
      },
      {
        title: 'Verification',
        description:
          'A second camera inspection confirms the line is fully clear and we check for any damage that needs attention.',
      },
      {
        title: 'Prevention Plan',
        description:
          'We provide tailored maintenance recommendations to prevent future clogs and extend the life of your plumbing.',
      },
    ],
    faqs: [
      {
        question: 'How often should I have my drains professionally cleaned?',
        answer:
          'For most homes, an annual cleaning keeps things flowing. If you have an older home, large trees near your sewer line, or frequent slow drains, we recommend every 6 months.',
      },
      {
        question: 'Is hydro-jetting safe for my pipes?',
        answer:
          'Yes. Hydro-jetting is safe for most residential plumbing. We adjust the pressure based on your pipe material and condition, and our camera inspection ensures there are no vulnerable areas first.',
      },
      {
        question: 'What causes recurring drain clogs?',
        answer:
          'The most common causes are grease buildup, hair, soap scum, and tree root intrusion in sewer lines. Our camera inspection identifies the exact cause so we can recommend a permanent solution.',
      },
    ],
    imageQuery: 'plumber cleaning drain pipe',
    priceFrom: '₹399 cleaning',
  },
  {
    slug: 'leak-detection',
    title: 'Leak Detection & Repair',
    shortTitle: 'Leak Detection',
    icon: 'Droplets',
    tagline: 'Find hidden leaks before they cause damage',
    summary:
      'Advanced acoustic and thermal imaging technology pinpoints hidden leaks behind walls, under floors, and underground — without demolition.',
    description:
      'Undetected leaks waste thousands of liters of water and can cause structural damage, mold, and higher utility bills. Our non-invasive leak detection uses acoustic listening devices, thermal cameras, and pressure testing to locate the exact source — then we repair it with minimal disruption to your home.',
    features: [
      'Non-invasive acoustic leak detection',
      'Thermal imaging for hidden leaks',
      'Slab leak detection and repair',
      'Underground water line leak detection',
      'Mold prevention consultation',
      'Insurance claim documentation',
    ],
    process: [
      {
        title: 'Pressure Test',
        description:
          'We pressurize your system and monitor for pressure drops that indicate a leak somewhere in the line.',
      },
      {
        title: 'Locate',
        description:
          'Using acoustic and thermal imaging equipment, we pinpoint the exact location of the leak without breaking walls.',
      },
      {
        title: 'Repair',
        description:
          'We access only the minimal area needed, repair the leak, and restore the pipe to full integrity.',
      },
      {
        title: 'Verify',
        description:
          'A final pressure test confirms the repair is complete and your system is leak-free.',
      },
    ],
    faqs: [
      {
        question: 'How do I know if I have a hidden leak?',
        answer:
          'Common signs include unexpectedly high water bills, the sound of running water when fixtures are off, warm spots on floors, and unexplained mold or moisture. If you notice any of these, call us for a detection service.',
      },
      {
        question: 'Can you detect leaks under a concrete slab?',
        answer:
          'Yes. Slab leak detection is one of our specialties. We use acoustic equipment and pressure testing to find the exact location under the slab, then access it with minimal concrete removal.',
      },
      {
        question: 'Will my insurance cover leak detection and repair?',
        answer:
          'Many home insurance policies cover sudden and accidental water damage. We provide detailed documentation including photos, reports, and itemized invoices to support your claim.',
      },
    ],
    imageQuery: 'plumber using detection equipment on pipes',
    priceFrom: '₹599 detection',
  },
  {
    slug: 'repiping',
    title: 'Whole-Home Repiping',
    shortTitle: 'Repiping',
    icon: 'GitBranch',
    tagline: 'Replace aging pipes for good',
    summary:
      'Galvanized or old PVC pipes failing? We replace your entire home\'s plumbing with durable CPVC or copper — cleanly and efficiently.',
    description:
      'Older homes with galvanized steel or degraded PVC pipes are prone to leaks, low water pressure, and discolored water. Our whole-home repiping service replaces every supply line with premium CPVC or copper piping, usually in 1-2 days, with minimal wall disruption and a lifetime warranty.',
    features: [
      'CPVC and copper repiping options',
      'Most homes completed in 1-2 days',
      'Minimal wall disruption — clean access points only',
      'Lifetime warranty on materials and labor',
      'Complete compliance with local codes',
      'Drywall patching included',
    ],
    process: [
      {
        title: 'Home Assessment',
        description:
          'We inspect your current plumbing, identify pipe material and condition, and provide a detailed repiping plan and quote.',
      },
      {
        title: 'Preparation',
        description:
          'We protect your floors and furniture, mark access points, and plan water shutoff times to minimize disruption.',
      },
      {
        title: 'Repipe',
        description:
          'Our team runs new CPVC or copper lines through walls and ceilings, connecting all fixtures with clean, precise work.',
      },
      {
        title: 'Test & Restore',
        description:
          'We pressure-test the new system, verify compliance, and patch all access holes — your home looks like new.',
      },
    ],
    faqs: [
      {
        question: 'How long does a whole-home repipe take?',
        answer:
          'Most single-family homes are completed in 1-2 days. Larger homes or complex layouts may take up to 3 days. We restore water each evening so you are not without it overnight.',
      },
      {
        question: 'CPVC or copper — which is better?',
        answer:
          'Both are excellent. CPVC is more affordable, flexible, and corrosion-resistant. Copper is more rigid, has a longer track record, and may be preferred for certain installations. We will recommend the best option for your home.',
      },
      {
        question: 'Will you fix the walls after repiping?',
        answer:
          'Yes. Drywall patching is included in every repipe project. We leave access holes ready for texture and paint, and can arrange full finishing for an additional fee.',
      },
    ],
    imageQuery: 'copper pipes installation in wall',
    priceFrom: 'Free estimate',
  },
  {
    slug: 'sewer-line-services',
    title: 'Sewer Line Repair & Replacement',
    shortTitle: 'Sewer Lines',
    icon: 'GitFork',
    tagline: 'Solve sewer problems for good',
    summary:
      'From tree root intrusion to collapsed lines, we repair and replace sewer lines using trenchless technology that saves your yard.',
    description:
      'Sewer line problems are serious — backups, odors, and potential health hazards. We use camera inspection to diagnose the issue, then offer traditional excavation or trenchless pipe bursting and pipe lining to fix it with minimal yard disruption. All work is fully compliant and inspected.',
    features: [
      'Trenchless pipe bursting and lining',
      'Sewer camera inspection included',
      'Tree root removal and prevention',
      'Sewer line replacement with warranty',
      'Compliance and inspection management',
      'Yard restoration included',
    ],
    process: [
      {
        title: 'Camera Inspection',
        description:
          'We run a high-definition camera through your sewer line to identify the exact problem — roots, cracks, collapses, or bellies.',
      },
      {
        title: 'Solution Design',
        description:
          'Based on the inspection, we recommend repair or replacement, traditional or trenchless, with a clear quote and timeline.',
      },
      {
        title: 'Execution',
        description:
          'Our team completes the repair or replacement using the chosen method, with minimal disruption to your landscaping.',
      },
      {
        title: 'Inspect & Restore',
        description:
          'We pass inspection, backfill, and restore the area so your yard looks as good as it did before.',
      },
    ],
    faqs: [
      {
        question: 'What is trenchless sewer repair?',
        answer:
          'Trenchless methods — pipe bursting and pipe lining — allow us to replace or repair underground sewer lines without digging a long trench across your yard. Only small access pits are needed, saving your landscaping, driveway, and hardscape.',
      },
      {
        question: 'How long does a sewer line last?',
        answer:
          'Cast iron and clay pipes last 50-80 years, while lower-quality pipes may last only 25-40. If your home was built before 1990, we recommend a camera inspection to assess your sewer line condition.',
      },
      {
        question: 'What causes sewer line damage?',
        answer:
          'The most common causes are tree root intrusion, ground shifting, pipe corrosion, and grease buildup. Regular camera inspections catch problems early before they become emergencies.',
      },
    ],
    imageQuery: 'sewer line excavation plumbing repair',
    priceFrom: 'Free estimate',
  },
  {
    slug: 'fixture-installation',
    title: 'Fixture Installation & Repair',
    shortTitle: 'Fixture Installation',
    icon: 'Wrench',
    tagline: 'Upgrade your kitchen & bath',
    summary:
      'Faucets, sinks, toilets, garbage disposals, and more — we install and repair all plumbing fixtures with precision and care.',
    description:
      'Whether you are remodeling your kitchen, upgrading a bathroom, or replacing a leaky faucet, our fixture installation service delivers clean, code-compliant work. We install all major brands and types, and we will even help you choose the right fixtures for your space and budget.',
    features: [
      'Faucet and sink installation',
      'Toilet installation and repair',
      'Garbage disposal installation',
      'Shower and bathtub fixture installation',
      'Geyser and water purifier installation',
      'Remodel plumbing rough-in and finish',
    ],
    process: [
      {
        title: 'Consultation',
        description:
          'We discuss what you want installed, verify compatibility with your current plumbing, and provide an upfront quote.',
      },
      {
        title: 'Preparation',
        description:
          'We shut off water, protect the work area, and remove old fixtures carefully to avoid damage to countertops or walls.',
      },
      {
        title: 'Installation',
        description:
          'Your new fixture is installed to manufacturer specifications with proper sealing, alignment, and connections.',
      },
      {
        title: 'Test & Clean',
        description:
          'We test for leaks, verify proper operation, and clean the work area so it is ready to use immediately.',
      },
    ],
    faqs: [
      {
        question: 'Can I buy my own fixtures and have you install them?',
        answer:
          'Absolutely. We are happy to install customer-supplied fixtures. We do recommend consulting with us first to ensure compatibility with your current plumbing setup.',
      },
      {
        question: 'Do you offer fixture recommendations?',
        answer:
          'Yes. Based on your style, budget, and plumbing setup, we recommend reliable brands and models that we trust and that are easy to maintain.',
      },
      {
        question: 'How long does a typical faucet installation take?',
        answer:
          'Most faucet installations take 1-2 hours. Toilet installations take about an hour. More complex installations like sinks or garbage disposals may take 2-3 hours.',
      },
    ],
    imageQuery: 'plumber installing bathroom faucet',
    priceFrom: '₹299 installation',
  },
  {
    slug: 'commercial-plumbing',
    title: 'Commercial Plumbing Services',
    shortTitle: 'Commercial Plumbing',
    icon: 'Building2',
    tagline: 'Plumbing solutions for your business',
    summary:
      'Restaurants, offices, retail, and industrial — we keep your business running with scheduled maintenance, fast repairs, and code compliance.',
    description:
      'Plumbing downtime costs your business money. Our commercial plumbing division provides preventative maintenance contracts, rapid repair response, and full-scale plumbing installation for new construction and remodels. We understand commercial codes, health department requirements, and the need to work around your business hours.',
    features: [
      'Preventative maintenance contracts',
      'Priority commercial service response',
      'Backflow testing and certification',
      'Grease trap installation and service',
      'Commercial water heater service',
      'After-hours and weekend scheduling',
    ],
    process: [
      {
        title: 'Needs Assessment',
        description:
          'We evaluate your facility, understand your operational requirements, and design a service plan that fits your business.',
      },
      {
        title: 'Service Agreement',
        description:
          'You receive a clear service contract with priority response times, scheduled maintenance, and transparent pricing.',
      },
      {
        title: 'Ongoing Maintenance',
        description:
          'Regular inspections and preventative service keep your plumbing in top condition and catch issues before they cause downtime.',
      },
      {
        title: 'Emergency Response',
        description:
          'When emergencies happen, commercial clients get priority dispatch and rapid response to minimize business interruption.',
      },
    ],
    faqs: [
      {
        question: 'Do you offer service contracts for businesses?',
        answer:
          'Yes. Our commercial service agreements include scheduled maintenance visits, priority emergency response, discounted rates, and detailed service records for compliance.',
      },
      {
        question: 'Can you work around our business hours?',
        answer:
          'Absolutely. We schedule maintenance and non-urgent repairs during your off-hours — nights, early mornings, or weekends — so your business is not interrupted.',
      },
      {
        question: 'Are you licensed for commercial plumbing work?',
        answer:
          'Yes. We are a fully licensed plumbing contractor and are fully insured for commercial work of any scale, from small offices to large industrial facilities.',
      },
    ],
    imageQuery: 'commercial plumbing building pipes',
    priceFrom: 'Custom quote',
  },
];

export type ProductDetail = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  description: string;
  features: string[];
  imageQuery: string;
  badge?: string;
};

export const products: ProductDetail[] = [
  {
    slug: 'racold-altro-50l',
    name: 'Racold Altro 50L Storage Water Heater',
    category: 'Water Heaters',
    brand: 'Racold',
    price: '₹8,999 installed',
    description:
      'Energy-efficient 50-liter storage water heater with titanium enamel coating and 4-star BEE rating for reliable hot water.',
    features: [
      '50-liter capacity',
      'Titanium enamel glass-lined tank',
      '4-star BEE energy rating',
      'Temperature control dial',
      '7-year tank warranty',
    ],
    imageQuery: 'modern water heater appliance',
    badge: 'Best Seller',
  },
  {
    slug: 'bajaj-calora-25l',
    name: 'Bajaj Calora 25L Vertical Water Heater',
    category: 'Water Heaters',
    brand: 'Bajaj',
    price: '₹6,499 installed',
    description:
      'Compact 25-liter vertical geyser with glass-lined tank and multiple safety systems, ideal for small families.',
    features: [
      '25-liter capacity',
      'Glass-lined inner tank',
      'Multi-functional safety valve',
      'Adjustable thermostat',
      '5-year tank warranty',
    ],
    imageQuery: 'tankless water heater wall unit',
    badge: 'Premium',
  },
  {
    slug: 'jaquar-smart-faucet',
    name: 'Jaquar Touchless Sensor Kitchen Faucet',
    category: 'Fixtures',
    brand: 'Jaquar',
    price: '₹12,999 installed',
    description:
      'Motion-activated smart faucet with precision sensor technology and premium brass construction for modern kitchens.',
    features: [
      'Touchless motion sensor',
      'Premium brass construction',
      'Chrome finish',
      'Battery operated',
      '5-year warranty',
    ],
    imageQuery: 'modern kitchen faucet stainless steel',
    badge: 'New',
  },
  {
    slug: 'hindware-toilet',
    name: 'Hindware Elongated One-Piece Toilet',
    category: 'Fixtures',
    brand: 'Hindware',
    price: '₹9,499 installed',
    description:
      'Sleek one-piece elongated toilet with dual-flush technology, soft-close seat, and anti-bacterial glaze.',
    features: [
      'Dual-flush 3L/6L',
      'One-piece seamless design',
      'Soft-close seat included',
      'Anti-bacterial ceramic glaze',
      '10-year warranty',
    ],
    imageQuery: 'modern white toilet bathroom',
  },
  {
    slug: 'insinkerator-disposal',
    name: 'InSinkErator Badger 5 Garbage Disposal',
    category: 'Fixtures',
    brand: 'InSinkErator',
    price: '₹14,999 installed',
    description:
      '1/2 HP garbage disposal with quiet operation and durable construction for efficient kitchen waste management.',
    features: [
      '1/2 HP motor',
      'Quiet operation',
      'Stainless steel grind components',
      'Compact design',
      '3-year warranty',
    ],
    imageQuery: 'garbage disposal kitchen appliance',
  },
  {
    slug: 'kent-whole-house-filter',
    name: 'KENT Grand+ Whole House Water Purifier',
    category: 'Water Treatment',
    brand: 'KENT',
    price: '₹18,999 installed',
    description:
      'RO + UV + UF purification system with 8L storage and mineral retention for safe, clean water throughout your home.',
    features: [
      'RO + UV + UF purification',
      '8-liter storage capacity',
      'Mineral retention technology',
      'Digital purity display',
      '3-year warranty',
    ],
    imageQuery: 'water filtration system home',
    badge: 'Eco Choice',
  },
  {
    slug: 'crompton-recirc-pump',
    name: 'Crompton Mini Water Pump',
    category: 'Accessories',
    brand: 'Crompton',
    price: '₹4,999 installed',
    description:
      'Compact booster pump for instant water pressure improvement at every tap, ideal for multi-story homes.',
    features: [
      'Instant pressure boost',
      '0.5 HP motor',
      'Automatic operation',
      'Compact design',
      '2-year warranty',
    ],
    imageQuery: 'water pump plumbing system',
  },
  {
    slug: 'smarthome-leak-detector',
    name: 'Smart Home Water Leak Detection System',
    category: 'Smart Home',
    brand: 'SOHAN',
    price: '₹11,999 installed',
    description:
      'Whole-home water monitoring and automatic shutoff. Detects leaks and protects your home from water damage 24/7.',
    features: [
      'Automatic shutoff on leak detection',
      'Real-time smartphone alerts',
      'Daily water usage tracking',
      'Pipe freeze detection',
      'Works with smart home systems',
    ],
    imageQuery: 'smart home water sensor device',
    badge: 'Smart Home',
  },
];

export type ReviewDetail = {
  name: string;
  location: string;
  rating: number;
  date: string;
  service: string;
  text: string;
  avatar: string;
};

export const reviews: ReviewDetail[] = [
  {
    name: 'Priya Sharma',
    location: 'Kolkata, WB',
    rating: 5,
    date: '2026-08-14',
    service: 'Emergency Plumbing',
    text: 'Our water heater burst at 11 PM on a Sunday. I called SOHAN PIPELINES and a plumber was at our door in 40 minutes. He had everything fixed and cleaned up by 1 AM. Absolutely incredible service when we needed it most.',
    avatar: 'PS',
  },
  {
    name: 'Rahul Verma',
    location: 'Howrah, WB',
    rating: 5,
    date: '2026-08-02',
    service: 'Repiping',
    text: 'We had our whole old home repiped from galvanized to CPVC. The crew was professional, on time, and finished in under two days. They patched all the walls and even helped move furniture. No hidden fees — the quote was exactly what we paid.',
    avatar: 'RV',
  },
  {
    name: 'Anjali Deshpande',
    location: 'Salt Lake, WB',
    rating: 5,
    date: '2026-07-22',
    service: 'Drain Cleaning',
    text: 'I had a recurring kitchen drain clog that three other plumbers could not fix permanently. SOHAN PIPELINES came out, did a camera inspection, found tree roots in the line, and hydro-jetted it clear. Three months later, still flowing perfectly.',
    avatar: 'AD',
  },
  {
    name: 'Vikram Patil',
    location: 'Durgapur, WB',
    rating: 5,
    date: '2026-07-10',
    service: 'Tankless Water Heater',
    text: 'Decided to go tankless and SOHAN PIPELINES made the whole process painless. They helped me pick the right unit, handled the gas line upgrade, and installed it in one day. My gas bill dropped noticeably the first month.',
    avatar: 'VP',
  },
  {
    name: 'Sneha Kulkarni',
    location: 'Asansol, WB',
    rating: 5,
    date: '2026-06-28',
    service: 'Leak Detection',
    text: 'My water bill doubled suddenly and I could not figure out why. SOHAN PIPELINES found a slab leak using their acoustic equipment — no destruction needed to find it. They repaired it through a tiny access hole. True professionals.',
    avatar: 'SK',
  },
  {
    name: 'Arjun Nair',
    location: 'Kharagpur, WB',
    rating: 5,
    date: '2026-06-15',
    service: 'Commercial Plumbing',
    text: 'We run a busy restaurant and plumbing issues can shut us down. SOHAN PIPELINES set up a maintenance contract and responds within the hour for emergencies. They understand commercial needs and work around our schedule. Highly recommend.',
    avatar: 'AN',
  },
  {
    name: 'Meera Joshi',
    location: 'Siliguri, WB',
    rating: 5,
    date: '2026-05-30',
    service: 'Fixture Installation',
    text: 'Had a new kitchen faucet and garbage disposal installed. The plumber was punctual, wore shoe covers, laid down drop cloths, and cleaned up so well you would never know he was here. The pricing was fair and there were no surprises.',
    avatar: 'MJ',
  },
  {
    name: 'Sanjay Agarwal',
    location: 'Bardhaman, WB',
    rating: 5,
    date: '2026-05-18',
    service: 'Sewer Line Repair',
    text: 'Our sewer line collapsed and I dreaded the thought of my yard being torn up. SOHAN PIPELINES used trenchless pipe bursting — only two small holes in the yard. The job was done in a day and my landscaping was barely disturbed. Worth every penny.',
    avatar: 'SA',
  },
  {
    name: 'Pooja Rane',
    location: 'Midnapore, WB',
    rating: 5,
    date: '2026-05-03',
    service: 'Emergency Plumbing',
    text: 'Called at 6 AM on a Saturday with a burst pipe flooding my garage. The dispatcher was calm and helpful, the plumber arrived in under 45 minutes, and they even helped me file the insurance claim. This is how emergency service should work.',
    avatar: 'PR',
  },
];

export type FAQItem = {
  question: string;
  answer: string;
};

export const generalFaqs: FAQItem[] = [
  {
    question: 'Are you licensed and insured?',
    answer:
      'Yes. SOHAN PIPELINES is a fully licensed plumbing contractor with MPCB certification and carries full general liability and workers compensation insurance. We are happy to provide documentation before any work begins.',
  },
  {
    question: 'Do you offer free estimates?',
    answer:
      'Yes, we provide free estimates for most non-emergency services including repiping, water heater installation, sewer line work, and remodel projects. Emergency service calls have a diagnostic fee that is applied toward your repair if you proceed.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We serve over 100 locations across West Bengal including Kolkata, Howrah, Bardhaman, Paschim Medinipur, Purba Medinipur, Jhargram, Bankura, Purulia, Birbhum, Nadia, Murshidabad, Malda, Darjeeling, Jalpaiguri, Alipurduar and Cooch Behar. See our Service Areas page for the full list.',
  },
  {
    question: 'Do you offer warranties on your work?',
    answer:
      'All workmanship is backed by our 5-year warranty. Products and equipment carry manufacturer warranties, and repiping comes with a lifetime warranty on both materials and labor. If something goes wrong with our work, we fix it free.',
  },
  {
    question: 'How do you price your services?',
    answer:
      'We use upfront, flat-rate pricing. You receive a detailed quote before any work begins, and the price does not change regardless of how long the job takes. No hourly charges, no surprise fees.',
  },
  {
    question: 'Can you help with my insurance claim?',
    answer:
      'Absolutely. For water damage and emergency repairs, we provide detailed documentation including photos, diagnostic reports, and itemized invoices that you can submit directly to your insurance company.',
  },
  {
    question: 'Do you offer financing?',
    answer:
      'Yes. We offer flexible payment options for larger projects like repiping, water heater installation, and sewer line replacement. Ask our team about available plans during your consultation.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, debit cards, UPI, cash, and bank transfers. For commercial accounts, we offer net-30 billing terms with an approved credit application.',
  },
];

export type ServiceArea = {
  name: string;
  zipCodes: string[];
};

export const serviceAreas: ServiceArea[] = [
  // Kolkata & surroundings
  { name: 'Kolkata', zipCodes: ['700001', '700016', '700019', '700020', '700027', '700032', '700053', '700064', '700091'] },
  { name: 'Howrah', zipCodes: ['711101', '711102', '711103', '711106', '711202', '711204'] },
  { name: 'Salt Lake (Bidhannagar)', zipCodes: ['700064', '700091', '700101', '700105', '700135'] },
  { name: 'New Town (Rajarhat)', zipCodes: ['700156', '700157', '700160'] },
  { name: 'Barrackpore', zipCodes: ['700120', '700122', '700123', '700125'] },
  { name: 'Dum Dum', zipCodes: ['700074', '700080'] },
  { name: 'Behala', zipCodes: ['700060', '700061'] },
  { name: 'Garia', zipCodes: ['700084', '700094'] },
  { name: 'Jadavpur', zipCodes: ['700032', '700068'] },
  { name: 'Tollygunge', zipCodes: ['700053', '700093'] },
  { name: 'Ballygunge', zipCodes: ['700019', '700053'] },
  { name: 'Shyambazar', zipCodes: ['700002', '700004'] },
  { name: 'Park Street', zipCodes: ['700016', '700017'] },
  // North 24 Parganas
  { name: 'North 24 Parganas — Barasat', zipCodes: ['700124', '700126'] },
  { name: 'North 24 Parganas — Basirhat', zipCodes: ['743411', '743412'] },
  { name: 'North 24 Parganas — Bongaon', zipCodes: ['743235', '743236'] },
  { name: 'North 24 Parganas — Habra', zipCodes: ['743263', '743266'] },
  { name: 'North 24 Parganas — Madhyamgram', zipCodes: ['700129', '700130'] },
  { name: 'North 24 Parganas — Khardah', zipCodes: ['700118'] },
  { name: 'North 24 Parganas — Titagarh', zipCodes: ['700119'] },
  // South 24 Parganas
  { name: 'South 24 Parganas — Alipore', zipCodes: ['700027', '700053'] },
  { name: 'South 24 Parganas — Baruipur', zipCodes: ['743372', '743387'] },
  { name: 'South 24 Parganas — Diamond Harbour', zipCodes: ['743331', '743332'] },
  { name: 'South 24 Parganas — Canning', zipCodes: ['743311', '743329'] },
  { name: 'South 24 Parganas — Kakdwip', zipCodes: ['743347', '743348'] },
  { name: 'South 24 Parganas — Joynagar', zipCodes: ['743337'] },
  // Nadia
  { name: 'Nadia — Krishnanagar', zipCodes: ['741101', '741102'] },
  { name: 'Nadia — Ranaghat', zipCodes: ['741201', '741203'] },
  { name: 'Nadia — Kalyani', zipCodes: ['741235', '741246'] },
  { name: 'Nadia — Chakdaha', zipCodes: ['741222', '741101'] },
  { name: 'Nadia — Shantipur', zipCodes: ['741404', '741407'] },
  { name: 'Nadia — Nabadwip', zipCodes: ['741302', '741303'] },
  // Murshidabad
  { name: 'Murshidabad — Berhampore', zipCodes: ['742101', '742102'] },
  { name: 'Murshidabad — Jangipur', zipCodes: ['742213', '742223'] },
  { name: 'Murshidabad — Kandi', zipCodes: ['742137', '742139'] },
  { name: 'Murshidabad — Jiwangarh', zipCodes: ['742123'] },
  { name: 'Murshidabad — Domkal', zipCodes: ['742303', '742304'] },
  // Hooghly
  { name: 'Hooghly — Chinsurah', zipCodes: ['712101', '712102'] },
  { name: 'Hooghly — Serampore', zipCodes: ['712201', '712202'] },
  { name: 'Hooghly — Chandannagar', zipCodes: ['712136', '712138'] },
  { name: 'Hooghly — Bandel', zipCodes: ['712121', '712123'] },
  { name: 'Hooghly — Arambagh', zipCodes: ['712601', '712611'] },
  { name: 'Hooghly — Tarakeswar', zipCodes: ['712410', '712411'] },
  // Bardhaman (Burdwan)
  { name: 'Bardhaman — Burdwan City', zipCodes: ['713101', '713103', '713104'] },
  { name: 'Bardhaman — Asansol', zipCodes: ['713301', '713302', '713304', '713305'] },
  { name: 'Bardhaman — Durgapur', zipCodes: ['713201', '713205', '713206', '713212', '713213'] },
  { name: 'Bardhaman — Kalna', zipCodes: ['713409', '713410'] },
  { name: 'Bardhaman — Katwa', zipCodes: ['713507', '713515'] },
  { name: 'Bardhaman — Memari', zipCodes: ['713146'] },
  // Paschim Medinipur (West Midnapore)
  { name: 'Paschim Medinipur — Midnapore', zipCodes: ['721101', '721102', '721103', '721104', '721305'] },
  { name: 'Paschim Medinipur — Kharagpur', zipCodes: ['721301', '721302', '721304', '721306', '721307'] },
  { name: 'Paschim Medinipur — Ghatal', zipCodes: ['721212', '721232'] },
  { name: 'Paschim Medinipur — Jhargram (Town)', zipCodes: ['721507'] },
  { name: 'Paschim Medinipur — Garhbeta', zipCodes: ['721121', '721127'] },
  { name: 'Paschim Medinipur — Dantan', zipCodes: ['721426', '721443'] },
  { name: 'Paschim Medinipur — Salboni', zipCodes: ['721516'] },
  { name: 'Paschim Medinipur — Chandrakona', zipCodes: ['721201', '721208'] },
  // Purba Medinipur (East Midnapore)
  { name: 'Purba Medinipur — Tamluk', zipCodes: ['721636', '721651'] },
  { name: 'Purba Medinipur — Contai (Kanthi)', zipCodes: ['721401', '721402', '721404', '721451'] },
  { name: 'Purba Medinipur — Haldia', zipCodes: ['721602', '721604', '721605', '721607'] },
  { name: 'Purba Medinipur — Egra', zipCodes: ['721429', '721437'] },
  { name: 'Purba Medinipur — Panskura', zipCodes: ['721139', '721152'] },
  { name: 'Purba Medinipur — Digha', zipCodes: ['721428', '721467'] },
  { name: 'Purba Medinipur — Ramnagar', zipCodes: ['721441'] },
  // Jhargram
  { name: 'Jhargram — Jhargram Town', zipCodes: ['721507', '721513'] },
  { name: 'Jhargram — Gopiballavpur', zipCodes: ['721517', '721524'] },
  { name: 'Jhargram — Nayagram', zipCodes: ['721506', '721522'] },
  { name: 'Jhargram — Sankrail', zipCodes: ['721515'] },
  // Bankura
  { name: 'Bankura — Bankura Town', zipCodes: ['722101', '722102', '722146'] },
  { name: 'Bankura — Bishnupur', zipCodes: ['722122', '722101'] },
  { name: 'Bankura — Khatra', zipCodes: ['722140', '722152'] },
  { name: 'Bankura — Sonamukhi', zipCodes: ['722107', '722129'] },
  { name: 'Bankura — Mejia', zipCodes: ['722143'] },
  // Purulia
  { name: 'Purulia — Purulia Town', zipCodes: ['723101', '723103', '723126', '723148'] },
  { name: 'Purulia — Raghunathpur', zipCodes: ['723121', '723133'] },
  { name: 'Purulia — Jhalda', zipCodes: ['723113', '723115'] },
  { name: 'Purulia — Manbazar', zipCodes: ['723131'] },
  { name: 'Purulia — Balarampur', zipCodes: ['723143'] },
  // Birbhum
  { name: 'Birbhum — Suri', zipCodes: ['731101', '731103', '731104'] },
  { name: 'Birbhum — Bolpur (Shantiniketan)', zipCodes: ['731204', '731235'] },
  { name: 'Birbhum — Rampurhat', zipCodes: ['731224'] },
  { name: 'Birbhum — Sainthia', zipCodes: ['731234', '731215'] },
  { name: 'Birbhum — Dubrajpur', zipCodes: ['731124', '731126'] },
  // Malda
  { name: 'Malda — English Bazar (Malda Town)', zipCodes: ['732101', '732102', '732103', '732121'] },
  { name: 'Malda — Chanchal', zipCodes: ['732126', '732145'] },
  { name: 'Malda — Old Malda', zipCodes: ['732107', '732108'] },
  { name: 'Malda — Kaliachak', zipCodes: ['732201', '732210'] },
  { name: 'Malda — Habibpur', zipCodes: ['732122'] },
  // Uttar Dinajpur
  { name: 'Uttar Dinajpur — Raiganj', zipCodes: ['733134', '733123', '733133'] },
  { name: 'Uttar Dinajpur — Islampur', zipCodes: ['733202', '733233'] },
  { name: 'Uttar Dinajpur — Kaliaganj', zipCodes: ['733225'] },
  { name: 'Uttar Dinajpur — Hemtabad', zipCodes: ['733128'] },
  { name: 'Uttar Dinajpur — Chopra', zipCodes: ['733207'] },
  // Dakshin Dinajpur
  { name: 'Dakshin Dinajpur — Balurghat', zipCodes: ['733103', '733101', '733102'] },
  { name: 'Dakshin Dinajpur — Gangarampur', zipCodes: ['733124', '733129'] },
  { name: 'Dakshin Dinajpur — Buniadpur', zipCodes: ['733121', '733122'] },
  { name: 'Dakshin Dinajpur — Tapan', zipCodes: ['733126', '733131'] },
  { name: 'Dakshin Dinajpur — Kushmandi', zipCodes: ['733125'] },
  // Darjeeling
  { name: 'Darjeeling — Darjeeling Town', zipCodes: ['734101', '734102'] },
  { name: 'Darjeeling — Siliguri', zipCodes: ['734001', '734003', '734004', '734005', '734006', '734010', '734011'] },
  { name: 'Darjeeling — Kurseong', zipCodes: ['734203', '734204'] },
  { name: 'Darjeeling — Mirik', zipCodes: ['734214'] },
  { name: 'Darjeeling — Kalimpong (Town)', zipCodes: ['734301'] },
  { name: 'Darjeeling — Phansidewa', zipCodes: ['734023', '734015'] },
  // Kalimpong
  { name: 'Kalimpong — Kalimpong Town', zipCodes: ['734301', '734316'] },
  { name: 'Kalimpong — Gorubathan', zipCodes: ['734313'] },
  { name: 'Kalimpong — Pedong', zipCodes: ['734311'] },
  { name: 'Kalimpong — Lava', zipCodes: ['734322'] },
  // Jalpaiguri
  { name: 'Jalpaiguri — Jalpaiguri Town', zipCodes: ['735101', '735102', '735125'] },
  { name: 'Jalpaiguri — Mainaguri', zipCodes: ['735122', '735208'] },
  { name: 'Jalpaiguri — Dhupguri', zipCodes: ['735210', '735220'] },
  { name: 'Jalpaiguri — Mal (Malbazar)', zipCodes: ['735221', '735222'] },
  { name: 'Jalpaiguri — Nagrakata', zipCodes: ['735225'] },
  // Alipurduar
  { name: 'Alipurduar — Alipurduar Town', zipCodes: ['736121', '736122'] },
  { name: 'Alipurduar — Falakata', zipCodes: ['736135', '736146'] },
  { name: 'Alipurduar — Hasimara', zipCodes: ['736142'] },
  { name: 'Alipurduar — Jaygaon', zipCodes: ['736152'] },
  { name: 'Alipurduar — Kalchini', zipCodes: ['736201'] },
  // Cooch Behar
  { name: 'Cooch Behar — Cooch Behar Town', zipCodes: ['736101', '736107', '736156'] },
  { name: 'Cooch Behar — Dinhata', zipCodes: ['736135', '736121'] },
  { name: 'Cooch Behar — Mathabhanga', zipCodes: ['736146', '736156'] },
  { name: 'Cooch Behar — Tufanganj', zipCodes: ['736159', '736160'] },
  { name: 'Cooch Behar — Mekhliganj', zipCodes: ['736303'] },
];

export const groupedServiceAreas: ServiceArea[] = (() => {
  const map = new Map<string, Set<string>>();
  for (const area of serviceAreas) {
    const groupName = area.name.includes(' — ')
      ? area.name.split(' — ')[0]
      : area.name;
    if (!map.has(groupName)) {
      map.set(groupName, new Set());
    }
    for (const zip of area.zipCodes) {
      map.get(groupName)!.add(zip);
    }
  }
  return Array.from(map.entries())
    .map(([name, zips]) => ({ name, zipCodes: Array.from(zips).sort() }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  yearsExperience: number;
  certifications: string[];
  initials: string;
};

export const team: TeamMember[] = [
  {
    name: 'Sohan Reddy',
    role: 'Founder & Master Plumber',
    bio: 'Sohan started SOHAN PIPELINES in 2009 with a single van and a commitment to honest, quality work. Fifteen years later, he leads a team of 22 plumbers serving the entire West Bengal region.',
    yearsExperience: 22,
    certifications: ['Master Plumber License', 'MPCB Certified', 'Safety Inspector'],
    initials: 'SR',
  },
  {
    name: 'Anita Desai',
    role: 'Operations Director',
    bio: 'Anita ensures every job runs smoothly — from dispatch to final inspection. She built our quality assurance program and oversees all commercial service contracts.',
    yearsExperience: 12,
    certifications: ['Plumbing License', 'Project Management Professional', 'ISO 9001 Auditor'],
    initials: 'AD',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Lead Service Plumber',
    bio: 'Rajesh is our go-to expert for complex diagnostics and emergency response. He has personally completed over 3,500 service calls and mentors our junior technicians.',
    yearsExperience: 16,
    certifications: ['Master Plumber License', 'Medical Gas Certified', 'Backflow Prevention'],
    initials: 'RK',
  },
  {
    name: 'Deepika Rao',
    role: 'Customer Care Manager',
    bio: 'Deepika leads our customer support team and ensures every client feels heard and valued. She manages our satisfaction guarantee program and handles all follow-up care.',
    yearsExperience: 9,
    certifications: ['Customer Experience Certified', 'Plumbing Industry Fundamentals'],
    initials: 'DR',
  },
];

export type WhyChooseUsItem = {
  icon: string;
  title: string;
  description: string;
};

export const whyChooseUs: WhyChooseUsItem[] = [
  {
    icon: 'Clock',
    title: '24/7 Emergency Response',
    description:
      'A live dispatcher answers every call, day or night. Our average response time is under 45 minutes for emergencies within our service area.',
  },
  {
    icon: 'BadgeCheck',
    title: 'Licensed & Insured',
    description:
      'Fully licensed plumbing contractor with MPCB certification and full insurance. Documentation provided before any work — your protection is our standard.',
  },
  {
    icon: 'Tag',
    title: 'Upfront Flat-Rate Pricing',
    description:
      'You approve the price before we start. No hourly charges, no surprise fees, no add-ons. The quote you get is the price you pay.',
  },
  {
    icon: 'ShieldCheck',
    title: '5-Year Workmanship Warranty',
    description:
      'Every repair is backed by our 5-year warranty. Repiping carries a lifetime warranty. If our work fails, we fix it at no cost.',
  },
  {
    icon: 'Users',
    title: '15 Years of Trusted Service',
    description:
      'Over 24,000 jobs completed and 2,100+ five-star reviews. We have earned our reputation one job at a time, and we intend to keep it.',
  },
  {
    icon: 'Sparkles',
    title: 'Clean & Respectful',
    description:
      'Shoe covers, drop cloths, and cleanup on every job. Our plumbers treat your home like their own — because your trust matters.',
  },
];

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Book or Call',
    description:
      'Schedule online or call us at 8670143003. Choose a time that works for you — same-day available for most services.',
    icon: 'PhoneCall',
  },
  {
    number: '02',
    title: 'Diagnose & Quote',
    description:
      'Your plumber arrives on time, assesses the issue, and provides a clear, upfront price. No work begins until you approve.',
    icon: 'Search',
  },
  {
    number: '03',
    title: 'Expert Repair',
    description:
      'We complete the work using premium materials and proven techniques. Clean, efficient, and done right the first time.',
    icon: 'Wrench',
  },
  {
    number: '04',
    title: 'Verify & Guarantee',
    description:
      'We test everything, clean the work area, and back the job with our 5-year warranty. Your satisfaction is guaranteed.',
    icon: 'ShieldCheck',
  },
];

export type StatItem = {
  value: string;
  label: string;
  icon: string;
};

export const stats: StatItem[] = [
  { value: '15+', label: 'Years in Business', icon: 'Calendar' },
  { value: '24,000+', label: 'Jobs Completed', icon: 'Wrench' },
  { value: '4.9/5', label: 'Customer Rating', icon: 'Star' },
  { value: '24/7', label: 'Emergency Service', icon: 'Clock' },
];

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: services.map((s) => ({
      label: s.shortTitle,
      href: `/services/${s.slug}`,
      description: s.tagline,
    })),
  },
  { label: 'Products', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Why Choose Us', href: '/why-choose-us' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];
