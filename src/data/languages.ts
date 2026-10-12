export type RuntimeKind = 'client-html' | 'client-css' | 'client-js' | 'piston' | 'sql' | 'none';

export interface Language {
  id: string;
  name: string;
  tagline: string;
  category: 'Web' | 'Pemrograman' | 'Data & Database' | 'Mobile' | 'AI & Data Science' | 'Sistem & DevOps' | 'Keamanan' | 'Hardware';
  runtime: RuntimeKind;
  /** nama bahasa di Piston (kalau beda dari id) */
  pistonName?: string;
  icon: string;
  color: string;
  popular?: boolean;
}

export const LANGUAGES: Language[] = [
  // Web
  { id: 'html', name: 'HTML', tagline: 'Struktur dasar setiap halaman web', category: 'Web', runtime: 'client-html', icon: '🏗️', color: '#E44D26', popular: true },
  { id: 'css', name: 'CSS', tagline: 'Styling & tata letak yang memukau', category: 'Web', runtime: 'client-css', icon: '🎨', color: '#264DE4', popular: true },
  { id: 'javascript', name: 'JavaScript', tagline: 'Bahasa pemrograman web paling populer', category: 'Web', runtime: 'client-js', icon: '⚡', color: '#F7DF1E', popular: true },
  { id: 'typescript', name: 'TypeScript', tagline: 'JavaScript dengan tipe data yang aman', category: 'Web', runtime: 'piston', pistonName: 'typescript', icon: '🔷', color: '#3178C6', popular: true },
  { id: 'php', name: 'PHP', tagline: 'Backend dinamis untuk web jutaan situs', category: 'Web', runtime: 'piston', pistonName: 'php', icon: '🐘', color: '#777BB4' },
  { id: 'reactjs', name: 'React', tagline: 'Library UI komponen dari Meta', category: 'Web', runtime: 'client-js', icon: '⚛️', color: '#61DAFB', popular: true },
  { id: 'angular', name: 'Angular', tagline: 'Framework lengkap dari Google', category: 'Web', runtime: 'none', icon: '🅰️', color: '#DD0031' },
  { id: 'vuejs', name: 'Vue', tagline: 'Framework progresif yang mudah dipelajari', category: 'Web', runtime: 'client-js', icon: '💚', color: '#42B883' },
  { id: 'nextjs', name: 'Next.js', tagline: 'React framework untuk produksi', category: 'Web', runtime: 'none', icon: '▲', color: '#000000' },

  // Pemrograman
  { id: 'python', name: 'Python', tagline: 'Sederhana, kuat, untuk apa saja', category: 'Pemrograman', runtime: 'piston', pistonName: 'python', icon: '🐍', color: '#3776AB', popular: true },
  { id: 'java', name: 'Java', tagline: 'Write once, run anywhere', category: 'Pemrograman', runtime: 'piston', pistonName: 'java', icon: '☕', color: '#ED8B00', popular: true },
  { id: 'c', name: 'C', tagline: 'Bahasa fundamental sistem & OS', category: 'Pemrograman', runtime: 'piston', pistonName: 'c', icon: '🔧', color: '#A8B9CC' },
  { id: 'cpp', name: 'C++', tagline: 'Performa tinggi untuk sistem & game', category: 'Pemrograman', runtime: 'piston', pistonName: 'c++', icon: '⚙️', color: '#00599C', popular: true },
  { id: 'csharp', name: 'C#', tagline: 'Bahasa modern dari Microsoft & .NET', category: 'Pemrograman', runtime: 'piston', pistonName: 'csharp', icon: '🟣', color: '#68217A' },
  { id: 'go', name: 'Go', tagline: 'Bahasa sederhana & cepat dari Google', category: 'Pemrograman', runtime: 'piston', pistonName: 'go', icon: '🐹', color: '#00ADD8' },
  { id: 'rust', name: 'Rust', tagline: 'Aman, cepat, tanpa garbage collector', category: 'Pemrograman', runtime: 'piston', pistonName: 'rust', icon: '🦀', color: '#DEA584' },
  { id: 'ruby', name: 'Ruby', tagline: 'Bahasa yang menyenangkan & produktif', category: 'Pemrograman', runtime: 'piston', pistonName: 'ruby', icon: '💎', color: '#CC342D' },
  { id: 'rails', name: 'Ruby on Rails', tagline: 'Framework web full-stack yang legendaris', category: 'Pemrograman', runtime: 'none', icon: '🛤️', color: '#D30001' },
  { id: 'kotlin', name: 'Kotlin', tagline: 'Bahasa resmi Android modern', category: 'Mobile', runtime: 'piston', pistonName: 'kotlin', icon: '🟪', color: '#7F52FF' },
  { id: 'swift', name: 'Swift', tagline: 'Bahasa Apple untuk iOS & macOS', category: 'Mobile', runtime: 'piston', pistonName: 'swift', icon: '🍎', color: '#F05138' },
  { id: 'bash', name: 'Bash', tagline: 'Otomatisasi & scripting terminal Linux', category: 'Sistem & DevOps', runtime: 'piston', pistonName: 'bash', icon: '🖥️', color: '#4EAA25' },
  { id: 'r', name: 'R', tagline: 'Statistik & visualisasi data', category: 'Data & Database', runtime: 'piston', pistonName: 'r', icon: '📊', color: '#276DC3' },

  // Data & Database
  { id: 'sql', name: 'SQL', tagline: 'Bahasa standar query database relasional', category: 'Data & Database', runtime: 'sql', icon: '🗄️', color: '#F29111', popular: true },
  { id: 'mysql', name: 'MySQL', tagline: 'Database relasional open-source terpopuler', category: 'Data & Database', runtime: 'sql', icon: '🐬', color: '#00758F' },
  { id: 'postgresql', name: 'PostgreSQL', tagline: 'Database objek-relasional paling canggih', category: 'Data & Database', runtime: 'sql', icon: '🐘', color: '#4169E1' },
  { id: 'mongodb', name: 'MongoDB', tagline: 'Database NoSQL dokumen yang fleksibel', category: 'Data & Database', runtime: 'none', icon: '🍃', color: '#47A248' },
  { id: 'sqlserver', name: 'SQL Server', tagline: 'Database enterprise dari Microsoft', category: 'Data & Database', runtime: 'none', icon: '🏢', color: '#CC2927' },

  // AI & Data Science
  { id: 'datascience', name: 'Data Science', tagline: 'Ilmu mengubah data menjadi keputusan', category: 'AI & Data Science', runtime: 'piston', pistonName: 'python', icon: '📈', color: '#FF6F61' },
  { id: 'ml', name: 'Machine Learning', tagline: 'Buat model yang belajar dari data', category: 'AI & Data Science', runtime: 'none', icon: '🤖', color: '#8E44AD' },
  { id: 'transformer', name: 'Transformer & LLM', tagline: 'Arsitektur di balik ChatGPT & AI modern', category: 'AI & Data Science', runtime: 'none', icon: '🧠', color: '#10A37F' },

  // Sistem & DevOps
  { id: 'git', name: 'Git', tagline: 'Version control standar developer dunia', category: 'Sistem & DevOps', runtime: 'none', icon: '🌿', color: '#F05032', popular: true },
  { id: 'dsa', name: 'Struktur Data & Algoritma', tagline: 'Fondasi wajib technical interview', category: 'Sistem & DevOps', runtime: 'piston', pistonName: 'python', icon: '🧩', color: '#0F9D58', popular: true },
  { id: 'linux', name: 'Linux', tagline: 'Sistem operasi server nomor satu dunia', category: 'Sistem & DevOps', runtime: 'none', icon: '🐧', color: '#FCC624' },
  { id: 'docker', name: 'Docker', tagline: 'Kemas aplikasi jadi container portabel', category: 'Sistem & DevOps', runtime: 'none', icon: '🐳', color: '#2496ED' },

  // Keamanan
  { id: 'cybersecurity', name: 'Cyber Security', tagline: 'Lindungi sistem dari serangan', category: 'Keamanan', runtime: 'none', icon: '🛡️', color: '#C0392B', popular: true },

  // Hardware
  { id: 'raspberrypi', name: 'Raspberry Pi', tagline: 'Komputer mini untuk proyek IoT', category: 'Hardware', runtime: 'none', icon: '🍓', color: '#C51A4A' },
  { id: 'arduino', name: 'Arduino', tagline: 'Mikrokontroler untuk elektronik & robotika', category: 'Hardware', runtime: 'none', icon: '🔌', color: '#00979D' },
  { id: 'scratch', name: 'Scratch', tagline: 'Visual programming untuk pemula & anak', category: 'Hardware', runtime: 'none', icon: '🐱', color: '#FF8C1A' },
];

export const CATEGORIES = [
  'Web',
  'Pemrograman',
  'Mobile',
  'Data & Database',
  'AI & Data Science',
  'Sistem & DevOps',
  'Keamanan',
  'Hardware',
] as const;

export function getLanguage(id: string): Language | undefined {
  return LANGUAGES.find((l) => l.id === id);
}
