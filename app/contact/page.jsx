'use client'
import { Mail, Send, MessageSquare, MapPin, ExternalLink } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white glow-text">Contact Us</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Send a Message</h2>
            <p className="text-gray-400 text-sm">Fill out the form below and we'll get back to you within 24 hours.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all appearance-none">
                <option value="support">Technical Support</option>
                <option value="business">Business Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
              <textarea placeholder="How can we help you?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all min-h-[150px] resize-none"></textarea>
            </div>

            <button className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 group">
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-300">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                  <p className="text-sm">support@cineverse.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Live Chat</p>
                  <p className="text-sm">Available Mon-Fri, 9am-5pm</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                  <p className="text-sm">Global Cinematic Hub, Digital World</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xl font-bold text-white">Social Media</h3>
            <p className="text-gray-400 text-sm">Follow us for latest updates and news.</p>
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'Discord'].map(social => (
                <button key={social} className="px-4 py-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-lg text-xs text-gray-300 hover:text-primary transition-all flex items-center gap-2">
                  {social} <ExternalLink className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
