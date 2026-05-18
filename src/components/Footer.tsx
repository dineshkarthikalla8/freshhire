import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--card)]/60 py-10 mt-12">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-start justify-between gap-6">
        <div>
          <Logo />
          <p className="text-sm text-[var(--muted-foreground)] mt-4 max-w-xs">FreshHire helps students and early-career engineers pass ATS filters and prepare for interviews with curated practice and resume feedback.</p>
        </div>

        <div className="flex gap-12">
          <div>
            <h4 className="font-bold mb-2">Product</h4>
            <ul className="space-y-1 text-sm text-[var(--muted-foreground)]">
              <li><Link to="/dsa">DSA Prep</Link></li>
              <li><Link to="/aptitude">Aptitude</Link></li>
              <li><Link to="/reasoning">Reasoning</Link></li>
              <li><Link to="/verbal">Verbal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2">Company</h4>
            <ul className="space-y-1 text-sm text-[var(--muted-foreground)]">
              <li><a href="#about">About</a></li>
              <li><Link to="/payment">Pricing</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--muted-foreground)] mt-8">© {new Date().getFullYear()} FreshHire — Built for students. All rights reserved.</div>
    </footer>
  )
}

export default Footer
