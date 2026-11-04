'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, User, CalendarCheck, FileText, 
  CreditCard, Clock, Bell, LogOut, BookOpen,
  Users, GraduationCap, Menu, Home, UserCheck, Shield
} from 'lucide-react';

const navItems = [
  // Admin Links
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
  { href: '/dashboard/admin/approvals', label: 'Pending Approvals', icon: UserCheck, roles: ['admin'] },
  { href: '/dashboard/admin/admins', label: 'Registered Admins', icon: Shield, roles: ['admin'] },
  { href: '/dashboard/admin/students', label: 'Students', icon: Users, roles: ['admin'] },
  { href: '/dashboard/admin/teachers', label: 'Teachers', icon: GraduationCap, roles: ['admin'] },
  { href: '/dashboard/admin/exams', label: 'Exams & Results', icon: FileText, roles: ['admin'] },
  { href: '/dashboard/admin/fees', label: 'Fees & Payments', icon: CreditCard, roles: ['admin'] },
  { href: '/dashboard/admin/timetable', label: 'Classes & Timetable', icon: CalendarCheck, roles: ['admin'] },
  { href: '/dashboard/admin/parents', label: 'Parent Portal', icon: Users, roles: ['admin'] },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText, roles: ['admin'] },
  { href: '/dashboard/admin/profile', label: 'Admin Profile', icon: User, roles: ['admin'] },
  
  // Student Links
  { href: '/dashboard/student', label: 'Home', icon: Home, roles: ['student'] },
  { href: '/dashboard/student/profile', label: 'My Profile', icon: User, roles: ['student'] },
  { href: '/dashboard/student/attendance', label: 'Attendance', icon: CalendarCheck, roles: ['student'] },
  { href: '/dashboard/student/results', label: 'Exam Results', icon: FileText, roles: ['student'] },
  { href: '/dashboard/student/fees', label: 'Fees & Payments', icon: CreditCard, roles: ['student'] },
  { href: '/dashboard/student/timetable', label: 'Time Table', icon: Clock, roles: ['student'] },
  { href: '/dashboard/student/notices', label: 'Notices', icon: Bell, roles: ['student'] },
  
  // Teacher Links
  { href: '/dashboard/teacher', label: 'Teacher Overview', icon: LayoutDashboard, roles: ['teacher'] },
  { href: '/dashboard/teacher/attendance', label: 'Mark Attendance', icon: CalendarCheck, roles: ['teacher'] },
  
  // Parent Links
  { href: '/dashboard/parent', label: 'Parent Overview', icon: LayoutDashboard, roles: ['parent'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [pendingCount, setPendingCount] = useState(0); 

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const name = localStorage.getItem('userName');
    
    if (!storedRole) {
      router.push('/');
    } else {
      setRole(storedRole);
      if (name) setUserName(name);
    }

    // Prevent going back to login page with browser back button
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, [router]);

  // Fetch pending count if user is admin
  useEffect(() => {
    if (role === 'admin') {
      fetch('/api/admin/pending')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setPendingCount(data.length);
        })
        .catch(console.error);
    }
  }, [role]);

  function logout() {
    localStorage.clear();
    router.push('/'); // Redirects to Home Page
  }

  const visibleNav = navItems.filter((n) => !role || n.roles.includes(role));

  // Bottom Nav for Mobile (Only show for students)
  const mobileNav = role === 'student' ? [
    { href: '/dashboard/student', label: 'Home', icon: Home },
    { href: '/dashboard/student/results', label: 'Subjects', icon: BookOpen },
    { href: '/dashboard/student/attendance', label: 'Attendance', icon: CalendarCheck },
    { href: '/dashboard/student/profile', label: 'More', icon: Menu }, 
  ] : [];

  return (
    <div className="min-h-screen flex bg-slate-50 relative pb-16 md:pb-0">
      
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      {role && (
        <aside className="hidden md:flex flex-col w-64 bg-[#0a1e42] text-slate-300 shrink-0 h-screen sticky top-0">
          
          {/* SIDEBAR LOGO */}
          <div className="h-20 flex items-center px-4 bg-white border-b shrink-0 gap-3">
            <img src="/logo.png" alt="School Logo" className="w-10 h-10 object-contain" />
            <h2 className="text-sm font-bold text-[#0a1e42] leading-tight">
              AM/ Nugelanda <br/> M V
            </h2>
          </div>
          
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </div>
                  {/* Show badge only on Pending Approvals link */}
                  {item.href === '/dashboard/admin/approvals' && pendingCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-white/10 shrink-0">
            <button onClick={logout} className="flex items-center gap-2 text-sm hover:text-white transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* MOBILE HEADER (Only visible on mobile) */}
        <header className="md:hidden bg-blue-700 text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md">
          
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-sm leading-tight">AM/ Nugelanda M V</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Bell size={20} />
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {userName.charAt(0)}
            </div>
          </div>
        </header>

        {/* DESKTOP HEADER */}
        <header className="hidden md:flex h-16 bg-white border-b px-6 items-center justify-between shrink-0">
          <input
            placeholder="Search anything..."
            className="bg-slate-100 rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
          />
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-slate-400 cursor-pointer" />
            <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{userName}</p>
                <p className="text-xs text-slate-500 capitalize">{role || 'Loading...'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {role === 'student' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

    </div>
  );
}