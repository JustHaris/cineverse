import { Shield, Lock, Eye, FileText } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | CineVerse',
  description: 'How we protect your data and privacy at CineVerse.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white glow-text">Privacy Policy</h1>
      </div>

      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 space-y-8 leading-relaxed text-gray-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" /> 1. Data Collection
          </h2>
          <p>
            At CineVerse, we collect minimal data to provide you with a personalized cinematic experience. This includes your account information, watchlist preferences, and basic interaction data to improve our recommendations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" /> 2. Information Usage
          </h2>
          <p>
            Your information is used strictly to sync your watchlist across devices, provide recommendations based on your viewing history, and ensure the security of your account. We never sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> 3. Cookies & Tracking
          </h2>
          <p>
            We use essential cookies and local storage to keep you logged in and remember your theme preferences. Optional analytics cookies help us understand how users interact with our platform to build better features.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             Security
          </h2>
          <p>
            We utilize industry-standard encryption and secure Firebase authentication to protect your account. While no platform is 100% secure, we take every precaution to safeguard your cinematic journey.
          </p>
        </section>

        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500 italic">
            Last updated: April 24, 2026. For any privacy-related inquiries, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}
