const mockCareers = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'developer',
    description: 'Build responsive user interfaces with modern JavaScript frameworks and thoughtful design systems.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    salary: '৳ 850,000 - 1,150,000',
    demand: 'High',
    tech: ['React', 'TypeScript', 'Figma', 'Storybook'],
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'developer',
    description: 'Design scalable server-side systems, APIs, and database solutions.',
    skills: ['Node.js', 'Databases', 'APIs', 'Architecture'],
    salary: '৳ 950,000 - 1,250,000',
    demand: 'High',
    tech: ['Node.js', 'PostgreSQL', 'Docker', 'GraphQL'],
    requiredSkills: ['Node.js', 'Databases', 'APIs', 'Architecture'],
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'cloud',
    description: 'Design and maintain scalable cloud systems with secure architecture.',
    skills: ['AWS', 'Azure', 'Cloud security', 'Automation'],
    salary: '৳ 1,100,000 - 1,450,000',
    demand: 'High',
    tech: ['AWS', 'GCP', 'Terraform', 'Ansible'],
    requiredSkills: ['AWS', 'Cloud security', 'Automation', 'Kubernetes'],
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    category: 'data',
    description: 'Develop and deploy machine learning systems that solve real-world problems.',
    skills: ['Machine Learning', 'Python', 'MLOps', 'Data pipelines'],
    salary: '৳ 1,200,000 - 1,600,000',
    demand: 'High',
    tech: ['Python', 'TensorFlow', 'Kubernetes', 'AWS SageMaker'],
    requiredSkills: ['Python', 'Machine Learning', 'MLOps', 'Data pipelines', 'Cloud'],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'data',
    description: 'Extract insights from data and build models that power business decisions.',
    skills: ['Statistics', 'Python', 'Data visualization', 'ML'],
    salary: '৳ 1,100,000 - 1,500,000',
    demand: 'High',
    tech: ['Python', 'SQL', 'Tableau', 'Pandas'],
    requiredSkills: ['Statistics', 'Python', 'Data visualization', 'SQL'],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'product',
    description: 'Define product strategy and work with teams to deliver customer value.',
    skills: ['Roadmapping', 'Research', 'Communication', 'Strategy'],
    salary: '৳ 1,000,000 - 1,400,000',
    demand: 'High',
    tech: ['Jira', 'Notion', 'Figma', 'Miro'],
    requiredSkills: ['Roadmapping', 'Research', 'Communication', 'Strategy'],
  },
];

const demoUserProfile = {
  name: 'Fahima',
  email: 'fahimafai@gmail.com',
  role: 'Aspiring AI Engineer',
  readinessScore: 74,
  skills: ['Python', 'Data Analysis', 'Git', 'SQL', 'Machine Learning'],
  goal: 'AI Engineer',
  location: 'Dhaka, Bangladesh',
  about: 'I am building toward AI engineering with a strong interest in machine learning, data analysis, and cloud deployment.',
  education: 'B.Sc. in Computer Science',
  experience: '2 years of software engineering and AI-focused projects',
  certification: 'AWS Cloud Practitioner',
  portfolio: 'https://portfolio.example.com/fahima',
};

const mockUser = demoUserProfile;
window.demoUserProfile = demoUserProfile;

const mockChatResponses = [
  'It looks like you should deepen your understanding of model deployment and cloud infrastructure.',
  'A great next step is a hands-on ML application that includes monitoring, scaling, and security.',
  'Focus on building a clear project narrative for recruiters and interviewers.',
];

const mockNotifications = [
  { title: 'Roadmap updated', detail: 'Your AI Engineer plan has a new weekly milestone.' },
  { title: 'Assessment completed', detail: 'Your mock skill gap analysis is ready for review.' },
];
