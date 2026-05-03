import Link from 'next/link';
import {
  ClipboardList,
  Clock,
  Zap,
  ArrowRight,
  Settings,
  Users,
  Check,
  BookOpen,
  FlaskConical,
  Bot
} from 'lucide-react';

export const metadata = {
  title: 'FillForm | Enterprise Google Forms Automation',
  description:
    'The most reliable engine for Google Forms automation and data population. trusted by researchers worldwide.',
};

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 animate-fade-in-up">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-50 text-sm font-semibold text-blue-700 border border-blue-100">
          ✨ The New Standard for Survey Automation
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
          Automate Google Forms. <br className="hidden sm:block" />
          <span className="text-blue-600">Flawlessly.</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The enterprise-grade engine for rapid data population. Generate thousands of structured responses without breaking a sweat.
        </p>
        
        {/* PLG Input Field Area */}
        <div className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <ClipboardList className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="url" 
              placeholder="Paste your Google Form URL here..." 
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium"
              required
            />
          </div>
          <Link href="/login" className="btn-primary sm:w-auto w-full whitespace-nowrap !py-3">
            Start Magic
          </Link>
        </div>
        <p className="text-sm text-slate-500 mt-4 font-medium">No credit card required. Free tier available.</p>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: 'Universal Support',
      desc: 'Handles multiple choice, short answer, linear scales, and complex conditional sections automatically.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Human-like Distribution',
      desc: 'Schedule distributions over days with natural intervals to avoid detection and maintain data integrity.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Execution',
      desc: 'Sync your form, set the parameters, and watch the results stream in real-time on your dashboard.',
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      title: 'Ratio Distribution',
      desc: 'Customize exact percentage distributions for each answer to match your demographic targets.',
      href: '/dien-form-theo-ti-le',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      title: 'Data-driven Fill',
      desc: 'Import your existing Excel or CSV data to perfectly populate forms based on historic records.',
      href: '/dien-form-theo-data-co-truoc',
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-purple-600" />,
      title: 'Research Model',
      desc: 'Strictly adhere to your research framework. We ensure the data passes all statistical validations (SPSS/AMOS).',
      href: '/dien-form-chuan-mo-hinh-nghien-cuu',
    },
    {
      icon: <Bot className="w-6 h-6 text-pink-600" />,
      title: 'AI Agent Generation',
      desc: 'Deploy AI agents to understand the context of the form and generate highly coherent, human-like responses.',
      href: '/dien-form-bang-ai-agent',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Solutions Built for Scale</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            From simple ratio-based surveys to complex academic research models, our suite of tools covers every data collection scenario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Link key={i} href={s.href} className="group block h-full">
              <div className="h-full bg-white rounded-2xl p-8 border border-slate-200 transition-all duration-200 hover:border-blue-500 hover:shadow-md flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{s.desc}</p>
                
                <div className="flex items-center text-sm font-semibold text-blue-600">
                  Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="price" className="py-24 bg-slate-50 border-t border-slate-200 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Transparent Pricing</h2>
          <p className="text-lg text-slate-600">Simple, predictable pricing. Pay only for what you use.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Self-service */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-blue-600 shadow-xl relative">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Self-Service</h3>
            <p className="text-slate-500 mb-6">Full control via our automation dashboard.</p>
            
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-slate-900">350₫</span>
              <span className="text-slate-500 font-medium">/ response</span>
            </div>

            <ul className="space-y-4 mb-10">
              {['Direct dashboard access', 'Pay-as-you-go credits', 'Unlimited active forms', 'All question types supported', 'Advanced delay scheduling'].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/login" className="btn-primary w-full text-center text-lg py-4">
              Get Started
            </Link>
          </div>

          {/* Managed Service */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Managed Service</h3>
            <p className="text-slate-500 mb-6">Let our experts handle complex requirements.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-lg text-slate-900">100,000₫</span>
                <span className="text-slate-500 font-medium">100 Responses</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-lg text-slate-900">150,000₫</span>
                <span className="text-slate-500 font-medium">200 Responses</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-bold text-lg text-slate-900">250,000₫</span>
                <span className="text-slate-500 font-medium">500 Responses</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              {['Guaranteed academic validity', 'Custom dataset building', 'Advanced SPSS analysis support', 'Dedicated account manager'].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <div className="mt-1 w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
            
            <a href="https://github.com/nphu0811" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full text-center text-lg py-4">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Ready to automate your research?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
          Join thousands of researchers and students who save hundreds of hours with FillForm.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
