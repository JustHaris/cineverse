import { FileText, Scale, Gavel, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | CineVerse',
  description: 'The rules and guidelines for using the CineVerse platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white glow-text">Terms of Service</h1>
      </div>

      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 space-y-8 leading-relaxed text-gray-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using CineVerse, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gavel className="w-5 h-5 text-primary" /> 2. User Accounts
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. CineVerse reserves the right to terminate accounts that violate our community guidelines or engage in fraudulent activity.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" /> 3. Content Usage
          </h2>
          <p>
            All movie data, images, and metadata are provided by TMDB. CineVerse is a tracking and discovery platform; we do not host or stream copyright-protected video content directly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            4. Limitation of Liability
          </h2>
          <p>
            CineVerse is provided "as is" without any warranties. We are not responsible for any technical issues, data loss, or inaccuracies in movie metadata provided by external APIs.
          </p>
        </section>

        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500 italic">
            Last updated: April 24, 2026. Your continued use of the platform constitutes acceptance of these terms.
          </p>
        </div>
      </div>
    </div>
  )
}
