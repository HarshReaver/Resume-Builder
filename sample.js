// Fake demo data for the "Load sample" button.
window.SAMPLE = {
  order: ['summary', 'experience', 'education', 'projects', 'skills', 'certifications'],
  name: 'Alex Morgan',
  title: 'Senior Software Engineer',
  email: 'alex.morgan@example.com',
  phone: '+1 555 010 4477',
  location: 'Austin, TX, USA',
  website: 'linkedin.com/in/alex-morgan-example',
  summary: 'Software engineer with nine years of experience building reliable web platforms and leading small teams. Strong at turning unclear requirements into simple, well-tested products. Comfortable across the stack, with a focus on performance, clear documentation and mentoring.',
  skills: 'JavaScript, TypeScript, Python, SQL, PostgreSQL, React, Node.js, Docker, AWS, Git, REST API design, Test automation, Team leadership, Technical writing',
  experience: [
    { role: 'Senior Software Engineer', company: 'Brightwave Analytics', location: 'Austin, TX', start: 'Mar 2021', end: 'Present',
      details: 'Lead a team of six engineers building the reporting platform used by 1,200 business clients.\nCut average dashboard load time from 6.2 s to 1.8 s by redesigning the query layer and adding caching.\nIntroduced code review guidelines and automated tests, reducing production incidents by 38 percent.\nMentored four junior developers, two of whom were promoted within 18 months.' },
    { role: 'Software Engineer', company: 'Northgate Logistics', location: 'Dallas, TX', start: 'Jun 2018', end: 'Feb 2021',
      details: 'Built route planning services in Python and PostgreSQL that handle 40,000 deliveries every day.\nMigrated a legacy monolith to containerised services with zero customer downtime.\nCreated an internal API used by five product teams, with clear documentation and versioning.\nTurned weekly operations pain points into small automated tools.' },
    { role: 'Junior Developer', company: 'Pixel & Grain Studio', location: 'Houston, TX', start: 'Jul 2016', end: 'May 2018',
      details: 'Delivered more than 20 responsive websites for retail and hospitality clients.\nWrote a reusable component library that cut new project setup from three days to one.\nFixed urgent client bugs within the agreed response time.' },
    { role: 'Software Engineering Intern', company: 'Lone Star Health', location: 'Austin, TX', start: 'Jun 2015', end: 'Aug 2015',
      details: 'Automated appointment reminder reports, saving the front desk about five hours per week.\nPresented the final project to the engineering leadership team.' }
  ],
  education: [
    { school: 'University of Texas at Austin', degree: 'B.S. in Computer Science', start: '2012', end: '2016',
      details: 'Graduated with honours, GPA 3.8 / 4.0.\nTeaching assistant for Data Structures and Algorithms.' },
    { school: 'Rice University Continuing Studies', degree: 'Certificate in Data Analytics', start: '2019', end: '2020',
      details: 'Evening program covering statistics, SQL and data visualisation.' }
  ],
  projects: [
    { name: 'OpenRoute Planner', link: 'github.com/example/openroute', tech: 'Python, SQLite, Leaflet',
      details: 'Open source tool that plans delivery routes for small shops; 600 stars from the community.\nWrote the documentation and a beginner guide that new contributors follow.' },
    { name: 'Budget Buddy', link: '', tech: 'React, Node.js',
      details: 'Offline-first budgeting app with 3,000 monthly users.\nAll data stays on the device, with export to CSV.' },
    { name: 'Local Library Finder', link: '', tech: 'JavaScript, REST APIs',
      details: 'Volunteer project that helps residents find nearby library services.\nBuilt with the city library team over a single weekend hackathon.' }
  ],
  certifications: [
    { name: 'AWS Certified Developer - Associate', issuer: 'Amazon Web Services', date: '2022' },
    { name: 'Professional Scrum Master I', issuer: 'Scrum.org', date: '2021' },
    { name: 'Google Data Analytics Certificate', issuer: 'Coursera', date: '2020' },
    { name: 'First Aid and CPR', issuer: 'Red Cross', date: '2023' }
  ]
};
