// client/src/data/projects.js

// Put your logo files in: client/public/logos/ (see filenames below)
// If a logo is missing, the card shows a soft gradient block instead.

const projects = [
  {
    id: 'workvite',
    title: 'Workvite',
    url: 'https://team-task-manager-p15t.onrender.com',
    logo: '/logos/workvite.png',
    blurb:
      'Team task manager with a React + Vite UI, Firebase auth (email/password + social logins), and an Express + Prisma API backed by PostgreSQL. Includes team/role-based organization and task workflows.',
    tags: ['React', 'Vite', 'Tailwind', 'Firebase', 'Express', 'Prisma', 'PostgreSQL'],
  },
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
]
  
  export default projects
  
