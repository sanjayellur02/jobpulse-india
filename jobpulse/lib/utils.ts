// Utility functions for JobPulse India

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export const employmentStatusOptions = [
  'Unemployed',
  'Internship',
  'Freelancing',
  'Part-time',
  'Employed',
];

export const degreeOptions = [
  'B.Tech',
  'B.E.',
  'B.Sc',
  'B.A',
  'B.Com',
  'Diploma',
  'ITI',
  'M.Tech',
  'MBA',
  'Other',
];

export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const skillsOptions = [
  'JavaScript',
  'Python',
  'Java',
  'React',
  'Node.js',
  'SQL',
  'HTML/CSS',
  'TypeScript',
  'AWS',
  'Docker',
  'Git',
  'MongoDB',
  'Communication',
  'Leadership',
  'Problem Solving',
];

export const truncateText = (text: string, length: number): string => {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/[^0-9]/g, ''));
};
