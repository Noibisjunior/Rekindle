import { Button } from '../ui/button';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  MessageSquareMore,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Workflow,
} from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin?: () => void;
}

const featureCards = [
  {
    icon: QrCode,
    title: 'Instant QR networking',
    description: 'Share your profile with a tap and let people connect in seconds.',
  },
  {
    icon: Users,
    title: 'Smart relationship tracking',
    description: 'Keep contacts organized by role, interests, and follow-up priority.',
  },
  {
    icon: Bell,
    title: 'Follow-up reminders',
    description: 'Never miss a chance to reconnect or build a meaningful opportunity.',
  },
  {
    icon: Workflow,
    title: 'Professional workflow',
    description: 'Turn networking into a clear and repeatable system for growth.',
  },
];

const metrics = [
  { value: '2x', label: 'more follow-up consistency' },
  { value: '3x', label: 'faster networking at events' },
  { value: '24/7', label: 'relationship visibility' },
];

const testimonials = [
  {
    name: 'Aisha Morgan',
    role: 'Startup founder',
    quote: 'Rekindle made every event feel intentional. I now remember every conversation and follow up without friction.',
  },
  {
    name: 'Daniel Price',
    role: 'Sales leader',
    quote: 'It feels like a professional CRM for real-world networking. My pipeline improved because I no longer lose context.',
  },
];

export default function WelcomeScreen({ onGetStarted, onLogin }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-[#fffaf4] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,38,53,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(230,184,0,0.14),_transparent_25%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="animated-section mb-14 flex items-center justify-between rounded-full border border-[#8B2635]/10 bg-white/80 px-4 py-3 shadow-sm shadow-[#8B2635]/5 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B2635] to-[#A0324B] shadow-lg shadow-[#8B2635]/20">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-[#8B2635]">Rekindle</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-[#8B2635]">Features</a>
            <a href="#how-it-works" className="transition hover:text-[#8B2635]">How it works</a>
            <a href="#proof" className="transition hover:text-[#8B2635]">Proof</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden text-slate-700 hover:text-[#8B2635] md:inline-flex" onClick={onLogin}>
              Log in
            </Button>
            <Button
              onClick={onGetStarted}
              className="rounded-full bg-gradient-to-r from-[#8B2635] to-[#A0324B] px-5 text-sm font-medium text-white shadow-lg shadow-[#8B2635]/20 hover:opacity-95"
            >
              Get started
            </Button>
          </div>
        </header>

        <main className="space-y-24">
          <section className="animated-section grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E6B800]/40 bg-[#FFF3CD] px-3 py-1.5 text-xs font-medium text-[#8B2635]">
                <Sparkles className="h-3.5 w-3.5 text-[#8B2635]" />
                Networking that actually sticks
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-[#2c0f1a] sm:text-5xl lg:text-6xl">
                Build stronger relationships with smarter follow-up.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Rekindle helps professionals capture conversations, organize meaningful connections, and turn every introduction into a future opportunity.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={onGetStarted}
                  className="h-12 rounded-full bg-[#8B2635] px-6 text-base font-medium text-white shadow-lg shadow-[#8B2635]/20 hover:bg-[#A0324B]"
                >
                  Create your profile
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-[#8B2635]/20 bg-white px-6 text-base font-medium text-[#8B2635] hover:bg-[#FFF3CD]"
                  onClick={onLogin}
                >
                  Log in
                </Button>
              </div>

              <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
                {metrics.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-[#8B2635]">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-float">
              <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-[#8B2635]/15 blur-3xl" />
              <div className="absolute -right-6 bottom-8 h-24 w-24 rounded-full bg-[#E6B800]/20 blur-3xl" />

              <div className="animate-glow relative overflow-hidden rounded-[28px] border border-[#8B2635]/10 bg-[#fffdf9] p-4 shadow-2xl shadow-[#8B2635]/10 backdrop-blur-xl">
                <div className="rounded-[22px] border border-[#8B2635]/10 bg-[#fffaf4] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B2635] to-[#E6B800] text-white">
                        <QrCode className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#2c0f1a]">Your profile</div>
                        <div className="text-xs text-slate-500">Ready to share</div>
                      </div>
                    </div>
                    <div className="rounded-full border border-[#8B2635]/20 bg-[#FFF3CD] px-2.5 py-1 text-xs font-medium text-[#8B2635]">
                      Live
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-[#FFF3CD] to-[#F7E7D0] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-[#2c0f1a]">Aisha Morgan</div>
                        <div className="text-sm text-slate-600">Founder • Product Leader</div>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#8B2635] to-[#E6B800] text-lg font-bold text-white">
                        AM
                      </div>
                    </div>

                    <div className="mt-5 grid gap-2 text-sm text-slate-700">
                      <div className="flex items-center justify-between rounded-xl border border-[#8B2635]/10 bg-white px-3 py-2">
                        <span>Networking score</span>
                        <span className="font-semibold text-[#8B2635]">96%</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-[#8B2635]/10 bg-white px-3 py-2">
                        <span>Follow ups due</span>
                        <span className="font-semibold text-[#A0324B]">3</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-dashed border-[#8B2635]/20 bg-[#fffdf9] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-700">Quick connect</div>
                      <div className="rounded-full bg-[#FFF3CD] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#8B2635]">
                        QR
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <div className="grid h-28 w-28 place-items-center rounded-2xl bg-white p-3 shadow-inner shadow-slate-300">
                        <div className="grid h-full w-full grid-cols-5 gap-1 rounded-xl bg-white">
                          {Array.from({ length: 25 }).map((_, index) => (
                            <div
                              key={index}
                              className={index % 2 === 0 ? 'rounded-sm bg-slate-900' : 'rounded-sm bg-white'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="animated-section space-y-8">
            <div className="text-center">
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B2635]">Why professionals choose Rekindle</div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#2c0f1a] sm:text-4xl">
                A purpose-built system for real-world connection.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map(({ icon: Icon, title, description }, index) => (
                <div
                  key={title}
                  className="animated-section rounded-3xl border border-[#8B2635]/10 bg-white p-6 shadow-sm shadow-[#8B2635]/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#8B2635]/30 hover:bg-[#fffdf9]"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B2635]/10 to-[#E6B800]/20 text-[#8B2635] ring-1 ring-[#8B2635]/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2c0f1a]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="how-it-works" className="animated-section rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8 lg:p-10">
            <div className="mb-10 text-center">
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-[#8B2635]">How it works</div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#2c0f1a] sm:text-4xl">
                From first hello to lasting connection.
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Create your profile',
                  body: 'Share who you are, what you do, and what kind of opportunities you love to create.',
                },
                {
                  step: '02',
                  title: 'Share or scan instantly',
                  body: 'Use QR codes or personal links to exchange contact details in seconds, without friction.',
                },
                {
                  step: '03',
                  title: 'Follow up with intent',
                  body: 'Set reminders, keep notes, and turn new relationships into ongoing momentum.',
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="animated-section rounded-3xl border border-[#8B2635]/10 bg-[#fffdf9] p-6 shadow-sm shadow-[#8B2635]/5"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8B2635] to-[#E6B800] text-sm font-semibold text-white">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-[#2c0f1a]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="proof" className="animated-section space-y-8">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8B2635]/20 bg-[#FFF3CD] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#8B2635]">
                <Star className="h-3.5 w-3.5 fill-current" />
                Trusted by ambitious teams
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#2c0f1a] sm:text-4xl">Built for leaders, founders, and builders.</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="animated-section rounded-3xl border border-[#8B2635]/10 bg-white p-6 shadow-sm shadow-[#8B2635]/5"
                  style={{ animationDelay: `${index * 140}ms` }}
                >
                  <div className="mb-5 flex items-center gap-1 text-[#E6B800]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg leading-8 text-slate-700">“{testimonial.quote}”</p>
                  <div className="mt-6 border-t border-[#8B2635]/10 pt-4">
                    <div className="font-semibold text-[#2c0f1a]">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="animated-section rounded-[32px] border border-[#8B2635]/10 bg-gradient-to-r from-[#FFF3CD] via-white to-[#FDF3E1] p-8 sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#8B2635] shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Built for real growth
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-[#2c0f1a] sm:text-4xl">Ready to rekindle meaningful relationships?</h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={onGetStarted}
                  className="h-12 rounded-full bg-[#8B2635] px-6 text-base font-medium text-white hover:bg-[#A0324B]"
                >
                  Start free
                </Button>
                <Button
                  variant="outline"
                  onClick={onLogin}
                  className="h-12 rounded-full border-[#8B2635]/20 bg-white px-6 text-base font-medium text-[#8B2635] hover:bg-[#FFF3CD]"
                >
                  Log in
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}