// pages/Home.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import {
  Brain, GraduationCap, Map, BookOpen, Bell, ShieldCheck,
  ChevronRight, Star, TrendingUp, Users, Zap, Award,
  ArrowRight, Sparkles, Target, BarChart3, MessageSquare
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const STATS = [
  { value: "50K+", label: "Students Guided", icon: Users },
  { value: "200+", label: "Colleges Listed", icon: GraduationCap },
  { value: "95%", label: "Satisfaction Rate", icon: Star },
  { value: "40+", label: "Career Paths", icon: TrendingUp },
];

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Aptitude Analysis",
    desc: "Take our intelligent assessment and receive a personalised stream recommendation — Science, Commerce, or Arts — aligned with your unique strengths.",
    accent: "#f59e0b",
    tag: "Smart"
  },
  {
    icon: Map,
    title: "Career Roadmap Builder",
    desc: "Explore 40+ career paths with step-by-step roadmaps, required qualifications, salary insights, and real-world growth trajectories.",
    accent: "#10b981",
    tag: "Guided"
  },
  {
    icon: GraduationCap,
    title: "Government College Finder",
    desc: "Browse verified government colleges filtered by state, stream, entrance exam, and scholarship availability — all in one reliable database.",
    accent: "#3b82f6",
    tag: "Verified"
  },
  {
    icon: BookOpen,
    title: "Entrance Exam Eligibility",
    desc: "Know exactly which exams you qualify for — JEE, NEET, CUET, and more — with preparation timelines and cutoff guidance.",
    accent: "#8b5cf6",
    tag: "Accurate"
  },
  {
    icon: Bell,
    title: "Real-Time Result Alerts",
    desc: "Get instant SMS and app notifications for board results, admission deadlines, and scholarship announcements — never miss a deadline.",
    accent: "#ec4899",
    tag: "Live"
  },
  {
    icon: ShieldCheck,
    title: "Verified & Secure Access",
    desc: "SMS-authenticated accounts protect your academic profile and progress data. Your journey is private, safe, and always accessible.",
    accent: "#f97316",
    tag: "Secure"
  },
];

const STEPS = [
  { num: "01", title: "Create Your Profile", desc: "Sign up with SMS verification, enter your Class 10 or 12 details, and set your academic goals." },
  { num: "02", title: "Take the Aptitude Test", desc: "Complete our AI-driven assessment covering logical reasoning, interests, and academic strengths." },
  { num: "03", title: "Get Personalised Paths", desc: "Receive stream recommendations, career options, and college shortlists tailored just for you." },
  { num: "04", title: "Track & Achieve", desc: "Monitor your progress, set reminders for key dates, and access mentors to stay on course." },
];

const TESTIMONIALS = [
  { name: "Priya S.", grade: "Class 12, Mumbai", text: "I was completely confused between PCB and PCM. The aptitude test gave me clarity I couldn't find anywhere else. Now I'm preparing for NEET with full confidence.", rating: 5 },
  { name: "Arjun K.", grade: "Class 10, Jaipur", text: "Found three government colleges I didn't even know existed, all with scholarships I qualify for. This platform saved me months of research.", rating: 5 },
  { name: "Meera T.", grade: "Class 12, Chennai", text: "The career roadmap for architecture was incredibly detailed. I could see exactly what I needed to do from today until I graduate.", rating: 5 },
];

/* ══════════════════════════════════════════════════════════════
   REUSABLE PRIMITIVES (Enhanced Responsive)
══════════════════════════════════════════════════════════════ */

// Fade-up reveal on scroll
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Section wrapper with responsive padding
const Section = ({ children, className = "" }) => (
  <section className={`relative px-5 sm:px-6 md:px-8 lg:px-12 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

// Label pill
const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-amber-400/10 text-amber-500 border border-amber-400/20">
    <Sparkles className="h-3 w-3" />{children}
  </span>
);

// Section heading with improved responsive typography
const Heading = ({ pill, title, sub, center = false }) => (
  <div className={`mb-10 sm:mb-12 md:mb-16 ${center ? "text-center" : ""}`}>
    {pill && <div className={`mb-3 sm:mb-4 ${center ? "flex justify-center" : ""}`}><Pill>{pill}</Pill></div>}
    <h2
      className="home-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4"
      dangerouslySetInnerHTML={{ __html: title }}
    />
    {sub && <p className="home-body text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed" style={center ? { margin: "0 auto" } : {}}>{sub}</p>}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   HERO (Fully Responsive)
══════════════════════════════════════════════════════════════ */
const TYPED_WORDS = ["Class 10 Students", "Class 12 Students", "Future Engineers", "Aspiring Doctors", "Tomorrow's Leaders"];

const Hero = () => {
  const heroRef = useRef(null);
  const typedRef = useRef(null);
  const gridRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // grid parallax
      gsap.to(gridRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      // orb float
      gsap.to(orb1Ref.current, { y: -30, x: 20, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(orb2Ref.current, { y: 20, x: -15, duration: 8, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });

      // typing loop
      let i = 0;
      const cycle = () => {
        if (!typedRef.current) return;
        gsap.to(typedRef.current, {
          duration: 0.5, opacity: 0, y: -12,
          onComplete: () => {
            i = (i + 1) % TYPED_WORDS.length;
            gsap.set(typedRef.current, { text: TYPED_WORDS[i], y: 12, opacity: 0 });
            gsap.to(typedRef.current, { duration: 0.5, opacity: 1, y: 0, onComplete: () => gsap.delayedCall(2.2, cycle) });
          }
        });
      };
      gsap.set(typedRef.current, { text: TYPED_WORDS[0] });
      gsap.delayedCall(2.5, cycle);
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-[85vh] sm:min-h-[90vh] md:min-h-[92vh] flex items-center overflow-hidden bg-gray-950">

      {/* dot grid bg */}
      <div ref={gridRef} className="absolute inset-0 will-change-transform"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* noise overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* glow orbs - hidden on mobile, smaller on tablet */}
      <div ref={orb1Ref} className="absolute top-[15%] right-[8%] w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full will-change-transform opacity-70 sm:opacity-100"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
      <div ref={orb2Ref} className="absolute bottom-[10%] left-[5%] w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full will-change-transform opacity-70 sm:opacity-100"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)" }} />

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 md:h-32" style={{ background: "linear-gradient(to bottom, transparent, #030712)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="max-w-3xl">
          {/* badge - responsive font size */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/8 text-amber-400 text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              One-Stop Personalized Career & Education Advisor
            </span>
          </motion.div>

          {/* headline - fully responsive */}
          <motion.h1
            className="home-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] sm:leading-[1.08] tracking-tight mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            The Right Path<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)" }}>
              for Every Student
            </span>
          </motion.h1>

          {/* typed line - responsive text sizes */}
          <motion.div
            className="home-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-500 mb-4 sm:mb-6 min-h-[2.5rem] flex flex-wrap items-center gap-1 sm:gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          >
            Built for&nbsp;<span ref={typedRef} className="text-white" />
            <span className="w-0.5 h-6 sm:h-7 md:h-8 bg-amber-400 animate-pulse ml-0.5 inline-block rounded-full" />
          </motion.div>

          {/* sub - responsive text */}
          <motion.p
            className="home-body text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mb-6 sm:mb-8 md:mb-10"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.65 }}
          >
            AI-driven aptitude tests, personalised career roadmaps, government college listings,
            scholarship alerts — everything a Class 10 &amp; 12 student needs to decide their future with confidence.
          </motion.p>

          {/* CTAs - stack on mobile, row on larger screens */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}
          >
            <Link to="/register" className="w-full sm:w-auto">
              <button className="hero-btn-primary group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3 rounded-xl text-sm font-bold text-gray-950 tracking-wide transition-all duration-300 active:scale-95 w-full sm:w-auto"
                style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)", boxShadow: "0 4px 24px rgba(245,158,11,0.35)" }}>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                Start for Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/how-it-works" className="w-full sm:w-auto">
              <button className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white hover:bg-gray-800/50 transition-all duration-300 home-body w-full sm:w-auto">
                See How It Works
                <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </motion.div>

          {/* trust strip - responsive */}
          <motion.p
            className="home-body mt-5 sm:mt-6 text-[10px] sm:text-xs text-gray-600 flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          >
            <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
            SMS-verified · Free for all students · No credit card needed
          </motion.p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   STATS BAR (Fully Responsive Grid)
══════════════════════════════════════════════════════════════ */
const StatsBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="bg-gray-900 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 lg:gap-0 lg:divide-x lg:divide-gray-800">
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="flex flex-col items-center text-center lg:px-6 xl:px-8"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-2 sm:mb-3">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
              </div>
              <span className="home-display text-2xl sm:text-3xl font-extrabold text-white mb-1">{value}</span>
              <span className="home-body text-[10px] sm:text-xs text-gray-500 font-medium tracking-wide uppercase">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   FEATURES (Responsive Grid)
══════════════════════════════════════════════════════════════ */
const FeatureCard = ({ icon: Icon, title, desc, accent, tag, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 3) * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl border border-gray-800 bg-gray-900/60 p-5 sm:p-6 hover:border-gray-700 hover:bg-gray-900 transition-all duration-300 overflow-hidden"
    >
      {/* glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 30% 20%, ${accent}0f 0%, transparent 60%)` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: accent }} />
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border"
            style={{ color: accent, borderColor: `${accent}30`, background: `${accent}10` }}>
            {tag}
          </span>
        </div>
        <h3 className="home-display text-white font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 group-hover:text-white/90">{title}</h3>
        <p className="home-body text-gray-500 text-xs sm:text-sm leading-relaxed group-hover:text-gray-400 transition-colors">{desc}</p>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HOW IT WORKS (Responsive with mobile layout)
══════════════════════════════════════════════════════════════ */
const HowItWorks = () => {
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1, transformOrigin: "top center",
          scrollTrigger: { trigger: lineRef.current, start: "top 80%", end: "bottom 20%", scrub: 1 }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <Section className="py-16 sm:py-20 md:py-28">
      <Reveal>
        <Heading
          pill="The Process"
          title="From Confusion to <span class='text-amber-400'>Clarity</span> — in 4 Steps"
          sub="No more guesswork. Our structured journey takes you from uncertainty to a concrete, personalised action plan."
        />
      </Reveal>

      <div className="relative">
        {/* vertical line - hidden on mobile */}
        <div ref={lineRef} className="hidden lg:block absolute left-[calc(50%-1px)] top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/60 via-amber-400/20 to-transparent origin-top" />

        <div className="space-y-8 md:space-y-10 lg:space-y-0">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.1}>
              <div className={`lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                <div className={`${i % 2 === 1 ? "lg:text-right lg:order-2" : ""} mb-5 lg:mb-0`}>
                  <div className={`flex items-center gap-3 mb-2 lg:mb-3 ${i % 2 === 1 ? "lg:justify-end" : ""}`}>
                    <span className="home-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 leading-none">{step.num}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent max-w-[40px] sm:max-w-[60px]" />
                  </div>
                  <h3 className="home-display text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2">{step.title}</h3>
                  <p className="home-body text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">{step.desc}</p>
                </div>

                {/* center dot - hidden on mobile, visible on larger screens */}
                <div className={`hidden lg:flex justify-center items-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-950 border-2 border-amber-400/60 flex items-center justify-center z-10 relative">
                      <span className="home-display text-amber-400 font-black text-base md:text-lg">{parseInt(step.num)}</span>
                    </div>
                    <div className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: "rgba(245,158,11,0.15)", animationDuration: `${2 + i * 0.4}s` }} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
};

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS (Responsive Grid)
══════════════════════════════════════════════════════════════ */
const TestimonialCard = ({ name, grade, text, rating, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6 flex flex-col gap-3 sm:gap-4 hover:border-gray-700 transition-colors"
    >
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, j) => (
          <Star key={j} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="home-body text-gray-300 text-xs sm:text-sm leading-relaxed flex-1">"{text}"</p>
      <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-gray-950">
          {name[0]}
        </div>
        <div>
          <p className="home-display text-white text-xs sm:text-sm font-semibold">{name}</p>
          <p className="home-body text-gray-500 text-[10px] sm:text-xs">{grade}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   CTA BANNER (Fully Responsive)
══════════════════════════════════════════════════════════════ */
const CTABanner = () => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-bg-orb",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1,
          scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 25%", scrub: 1 }
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <Section className="py-16 sm:py-20 md:py-28">
      <Reveal>
        <div ref={ref} className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-400/20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 p-6 sm:p-8 md:p-12 lg:p-16 text-center">

          {/* bg orbs - hidden on mobile */}
          <div className="cta-bg-orb absolute -top-20 -left-20 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full opacity-50 sm:opacity-100"
            style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
          <div className="cta-bg-orb absolute -bottom-20 -right-20 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full opacity-50 sm:opacity-100"
            style={{ background: "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)" }} />

          <div className="relative z-10">
            <Pill>Get Started Today</Pill>
            <h2 className="home-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mt-4 sm:mt-5 mb-3 sm:mb-4 leading-tight">
              Your Future Deserves<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
                a Clear Direction
              </span>
            </h2>
            <p className="home-body text-gray-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-6 sm:mb-8 md:mb-10">
              Join 50,000+ students already using CollegeFinder to unlock their ideal career path — completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/register" className="w-full sm:w-auto">
                <button className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-bold text-gray-950 transition-all duration-300 active:scale-95 home-body w-full sm:w-auto"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)", boxShadow: "0 6px 28px rgba(245,158,11,0.35)" }}>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                  Take your first Comprehensive test
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform" />
                </button>
              </Link>
              <Link to="/colleges" className="w-full sm:w-auto">
                <button className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white hover:bg-gray-800/50 transition-all duration-300 home-body w-full sm:w-auto">
                  Browse Colleges
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
};

/* ══════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
const Home = () => {

  // GSAP horizontal marquee for features strip
  const marqueeRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".marquee-inner", {
        xPercent: -50,
        ease: "none",
        duration: 22,
        repeat: -1,
      });
    }, marqueeRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .home-display { font-family: 'Bricolage Grotesque', sans-serif; }
        .home-body    { font-family: 'DM Sans', sans-serif; }

        html { scroll-behavior: smooth; }
        body { background: #030712; }

        .hero-btn-primary:hover {
          box-shadow: 0 6px 32px rgba(245,158,11,0.45) !important;
          transform: translateY(-1px);
        }
        
        /* Responsive touch targets for mobile */
        @media (max-width: 640px) {
          button, a { 
            min-height: 44px;
          }
        }
      `}</style>

      <div className="bg-gray-950 text-white overflow-x-hidden">

        {/* ── Hero ── */}
        <Hero />

        {/* ── Stats ── */}
        <StatsBar />

        {/* ── Marquee strip (responsive spacing) ── */}
        <div ref={marqueeRef} className="overflow-hidden py-3 sm:py-5 border-b border-gray-900 bg-gray-950">
          <div className="marquee-inner flex gap-6 sm:gap-10 whitespace-nowrap will-change-transform" style={{ width: "200%" }}>
            {[...Array(2)].map((_, rep) => (
              <div key={rep} className="flex gap-6 sm:gap-10">
                {["AI Career Advisor", "Class 10 Guidance", "Class 12 Streams", "Government Colleges", "Scholarship Finder", "NEET · JEE · CUET", "Real-Time Alerts", "Progress Tracking"].map((t, i) => (
                  <span key={i} className="home-body text-[9px] sm:text-xs font-semibold tracking-widest uppercase text-gray-600 flex items-center gap-2 sm:gap-3">
                    <span className="w-1 h-1 rounded-full bg-amber-400/50 inline-block" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Features ── */}
        <Section className="py-16 sm:py-20 md:py-28">
          <Reveal>
            <Heading
              pill="Platform Features"
              title="Everything You Need,<br/><span class='text-amber-400'>Nothing You Don't</span>"
              sub="Built specifically for Indian students navigating the crossroads of Class 10 and Class 12 — not a generic career tool."
            />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
          </div>
        </Section>

        {/* ── How it Works ── */}
        <div className="bg-gray-900/40 border-y border-gray-800/60">
          <HowItWorks />
        </div>

        {/* ── Target audience callout (fully responsive) ── */}
        <Section className="py-16 sm:py-20 md:py-24">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
              {[
                {
                  icon: Target,
                  title: "Class 10 Students",
                  points: ["Choose the right stream (Science / Commerce / Arts)", "Understand which subjects unlock which careers", "Start your entrance exam preparation early", "Discover scholarship opportunities ahead of time"],
                  accent: "#f59e0b",
                },
                {
                  icon: BarChart3,
                  title: "Class 12 Students",
                  points: ["Shortlist government colleges for your marks range", "Check JEE, NEET, CUET eligibility instantly", "Get real-time admission & result notifications", "Build a concrete career roadmap post-board exams"],
                  accent: "#3b82f6",
                }
              ].map(({ icon: Icon, title, points, accent }) => (
                <div key={title} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 sm:p-6 md:p-7 hover:border-gray-700 transition-colors">
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
                      <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" style={{ color: accent }} />
                    </div>
                    <h3 className="home-display text-white font-bold text-base sm:text-lg md:text-xl">{title}</h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {points.map((p, i) => (
                      <li key={i} className="home-body flex items-start gap-2 sm:gap-2.5 text-gray-400 text-xs sm:text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* ── Testimonials ── */}
        <div className="bg-gray-900/30 border-y border-gray-800/50">
          <Section className="py-16 sm:py-20 md:py-28">
            <Reveal>
              <Heading
                center
                pill="Student Stories"
                title="Real Students, <span class='text-amber-400'>Real Clarity</span>"
                sub="Thousands of students have already found direction. Here's what they say."
              />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
              {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} {...t} index={i} />)}
            </div>
          </Section>
        </div>

        {/* ── CTA Banner ── */}
        <CTABanner />

        {/* ── Footer strip (fully responsive) ── */}
        <div className="border-t border-gray-900 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gray-800 flex items-center justify-center">
                <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
              </div>
              <span className="home-display text-white font-bold text-xs sm:text-sm">CollegeFinder</span>
            </div>
            <p className="home-body text-gray-600 text-[10px] sm:text-xs text-center">
              © {new Date().getFullYear()} CollegeFinder · Empowering students across India
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              {["Privacy", "Terms", "Contact"].map(l => (
                <Link key={l} to={`/${l.toLowerCase()}`} className="home-body text-gray-600 hover:text-gray-400 text-[10px] sm:text-xs transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Home;