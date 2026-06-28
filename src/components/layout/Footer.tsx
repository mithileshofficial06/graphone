import Link from 'next/link';

const footerLinks = {
  platform: [
    { href: '/', label: 'AI Companies' },
    { href: '/investors', label: 'Investors' },
    { href: '/products', label: 'AI Products' },
    { href: '/funding', label: 'Funding Rounds' },
    { href: '/jobs', label: 'AI Jobs' },
  ],
  resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/newsletter', label: 'Newsletter' },
    { href: '/reports', label: 'Reports' },
    { href: '/api', label: 'API' },
    { href: '/help', label: 'Help Center' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/contact', label: 'Contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-lg font-bold tracking-tight">GraphOne</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              The global intelligence layer for the AI economy.
            </p>
          </div>

          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-foreground mb-4 capitalize">
                {key}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Newsletter</h3>
            <p className="text-zinc-500 text-sm mb-4 leading-relaxed">
              Weekly AI insights and funding updates
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-l-lg text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
              />
              <button className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-r-lg hover:opacity-90 transition-opacity text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.08] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} GraphOne. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/twitter"
              className="text-zinc-500 hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/[0.04]"
              aria-label="Twitter"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
            <Link
              href="/linkedin"
              className="text-zinc-500 hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/[0.04]"
              aria-label="LinkedIn"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
