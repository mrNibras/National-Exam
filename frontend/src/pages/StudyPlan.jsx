import DashboardLayout from "@/components/DashboardLayout";
import { mockStudentStats } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const StudyPlan = () => {
  const { weaknesses, strengths, subjectPerformance } = mockStudentStats;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">My Study Plan</h1>
          <p className="text-muted-foreground mt-1">Focus on your weak areas to maximize improvement</p>
        </div>

        {/* Subject overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {subjectPerformance.map(sp => (
            <div key={sp.subject} className="bg-card rounded-xl p-4 shadow-card border border-border text-center">
              <p className="text-2xl font-heading font-bold text-card-foreground">{sp.score}%</p>
              <p className="text-xs text-muted-foreground mt-1">{sp.subject}</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", sp.score >= 75 ? "bg-success" : sp.score >= 50 ? "bg-warning" : "bg-destructive")} style={{ width: `${sp.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weaknesses */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="font-heading font-semibold text-lg text-foreground">Areas to Improve</h2>
            </div>
            <div className="space-y-3">
              {weaknesses.map((w, i) => (
                <motion.div
                  key={w.topic}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-card-foreground">{w.topic}</p>
                    <p className="text-xs text-muted-foreground">{w.subject} • {w.questionsAttempted} questions</p>
                    <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive/70 rounded-full" style={{ width: `${w.accuracy}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-destructive">{w.accuracy}%</span>
                  </div>
                  <Link to="/practice">
                    <Button variant="outline" size="sm">
                      Practice <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <h2 className="font-heading font-semibold text-lg text-foreground">Your Strengths</h2>
            </div>
            <div className="space-y-3">
              {strengths.map((s, i) => (
                <motion.div
                  key={s.topic}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl p-4 shadow-card border border-border flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-card-foreground">{s.topic}</p>
                    <p className="text-xs text-muted-foreground">{s.subject} • {s.questionsAttempted} questions</p>
                    <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: `${s.accuracy}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-success">{s.accuracy}%</span>
                </motion.div>
              ))}
            </div>

            {/* Study tip */}
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-5">
              <h3 className="font-heading font-semibold text-sm text-foreground">💡 Study Tip</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Focus 70% of your study time on weak areas and 30% on maintaining your strengths. Take at least 2 practice tests daily for the best results.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudyPlan;