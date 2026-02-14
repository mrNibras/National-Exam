import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { BookOpen, BarChart3, Brain, Users, Target, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
// import heroBg from "@/assets/hero-bg.jpg"; // Temporarily commented out to test

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Brain, title: "Adaptive Testing", desc: "Questions adjust to your level using our Elo-based engine for optimal learning." },
  { icon: BarChart3, title: "Performance Analytics", desc: "Track your strengths, weaknesses, and progress with detailed dashboards." },
  { icon: Target, title: "Personalized Study Plans", desc: "AI-powered recommendations to focus on topics where you need the most improvement." },
  { icon: Users, title: "School Leaderboards", desc: "Compete with peers and stay motivated with real-time rankings." },
  { icon: Zap, title: "Offline Mode", desc: "Practice anywhere, anytime — even without internet. Sync when you're back online." },
  { icon: BookOpen, title: "Curriculum Aligned", desc: "Questions mapped to Ethiopian national curriculum for Grades 9-12." },
];

const steps = [
  { num: "01", title: "Create Your Account", desc: "Sign up as a student or teacher in under a minute." },
  { num: "02", title: "Choose Your Subjects", desc: "Select from Mathematics, Physics, Chemistry, Biology, and more." },
  { num: "03", title: "Start Practicing", desc: "Take adaptive quizzes that match your current ability level." },
  { num: "04", title: "Track & Improve", desc: "Review your analytics, follow your study plan, and watch your scores rise." },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {/* Placeholder div instead of image to avoid potential loading issues */}
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary opacity-20"></div>
          <div className="absolute inset-0 gradient-hero opacity-85" />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm text-primary-foreground/90 font-medium">🇪🇹 Built for Ethiopian Students</span>
            </motion.div>
            <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight">
              Ace Your National
              <span className="block text-gradient">Exams</span>
            </motion.h1>
            <motion.p custom={2} variants={fadeUp} className="text-lg md:text-xl text-primary-foreground/80 mt-6 max-w-lg">
              Adaptive practice tests, real-time analytics, and personalized study plans for Grades 9-12 and university entrance exams.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-4 mt-8">
              <Link to="/register">
                <Button variant="gold" size="xl">
                  Start Practicing Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline-hero" size="xl">
                  I Have an Account
                </Button>
              </Link>
            </motion.div>
            <motion.div custom={4} variants={fadeUp} className="flex flex-wrap gap-6 mt-8 text-primary-foreground/70 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-5 h-5" /> 10,000+ Questions</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-5 h-5" /> Works Offline</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-5 h-5" /> Free to Start</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Our platform combines adaptive technology with Ethiopia's national curriculum to give you the best exam preparation experience.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-elevated transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-card-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-3">Get started in four simple steps</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-heading font-bold text-gradient mb-4">{s.num}</div>
                <h3 className="font-heading font-semibold text-lg text-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="gradient-hero rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">Ready to Start Your Journey?</h2>
              <p className="text-primary-foreground/80 mt-4 max-w-lg mx-auto">Join thousands of Ethiopian students preparing for their national exams with confidence.</p>
              <Link to="/register">
                <Button variant="gold" size="xl" className="mt-8">
                  Get Started — It's Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-foreground">ExamPrep Ethiopia</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 ExamPrep. Built for Ethiopian students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;