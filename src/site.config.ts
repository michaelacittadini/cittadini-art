// Single place for site-wide settings. Mr K edits this file; never hard-code these elsewhere.
export const site = {
  name: 'Misha Cittadini',
  legalName: 'Michaela Cittadini',
  tagline: 'Abstract painter',
  description: 'Misha Cittadini is a Czech-born abstract painter based in the San Francisco Bay Area. Browse original paintings by series, exhibitions, and enquire about originals and commissions.',
  email: 'misha@cittadini.art',
  instagram: 'https://www.instagram.com/mishacittadiniart/',
  studio: 'ICB Building, Studio 107, 480 Gate 5 Rd, Sausalito, CA 94965',
  location: 'Sausalito, California',
  // Commerce plug-ins (placeholders until Misha's own accounts exist; see docs/COMMERCE.md).
  commerce: {
    // Stripe Payment Links per artwork slug, e.g. { 'blue-hour': 'https://buy.stripe.com/...' }.
    // Leave empty to show an "Enquire" button instead of "Buy".
    stripePaymentLinks: {} as Record<string, string>,
    // Prodigi print-on-demand: set to true once a Prodigi account + product SKUs are configured.
    printsEnabled: false,
  },
  newsletter: {
    // Form endpoint from Misha's newsletter provider (e.g. Buttondown/Mailchimp embed action URL).
    // Empty = signup form shows an email link instead.
    formAction: '',
    emailFieldName: 'email',
  },
};
