// client/src/data/projects.js

// Put your logo files in: client/public/logos/ (see filenames below)
// If a logo is missing, the card shows a soft gradient block instead.

const projects = [
    {
      id: 'customer_review',
      title: 'Customer Review Sentiment Analyzer',
      url: 'https://customer-review-model-7t2lzkzmuhxa8vdhqxge2r.streamlit.app/',
      logo: '/logos/customer_review.png',
      blurb:
        'A web application for analyzing the sentiment of customer reviews. Supports text input and CSV file uploads for batch processing.',
      tags: ['Python', 'Streamlit', 'TextBlob', 'NLTK', 'Pandas'],
    },
    {
      id: 'dcr',
      title: 'DCR Auto Electrics',
      url: 'https://dcr-4tvi.onrender.com/',
      logo: '/logos/dcr.png', // upload to client/public/logos/dcr.png
      blurb:
        'Dark modern brand site with subtle motion, glows and gradient accents.',
      tags: ['React', 'Vite', 'Framer Motion', 'Tailwind', 'Express', 'Node'],
    },
    {
      id: 'auto-diesel',
      title: 'Auto Diesel',
      url: 'https://auto-diesel.onrender.com/',
      logo: '/logos/auto-diesel.png',
      blurb:
        'Service website with clean IA, responsive sections and trust signals.',
      tags: ['React', 'Tailwind', 'Express', 'Vite', 'Node'],
    },
    {
      id: 'svm',
      title: 'Slick Mobile Valets & Detailing',
      url: 'https://svm-heic.onrender.com/',
      logo: '/logos/svm.png',
      blurb:
        'Mobile detailing site with booking CTA and polished glass surfaces.',
      tags: ['JavaScript', 'Tailwind', 'Express', 'EJS', 'Node'],
    },
    {
      id: 'acc',
      title: 'ACC Valets & Detailing',
      url: 'https://acc-valets-and-detailing.onrender.com/',
      logo: '/logos/acc.png',
      blurb:
        'Booking flow, responsive marketing site, analytics + SEO.',
      tags: ['Node', 'Express', 'EJS', 'CSS'],
    },
  ]
  
  export default projects
  