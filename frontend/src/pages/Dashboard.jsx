import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { mockStudentStats, subjects } from "@/lib/mock-data";
import { Trophy, Target, Flame, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const stats = mockStudentStats;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Welcome back, Abebe! 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your learning progress overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Ability Score" value={stats.abilityScore} icon={BarChart3} trend={5} />
          <StatCard title="Tests Completed" value={stats.testsCompleted} icon={Target} trend={12} />
          <StatCard title="Average Score" value={`${stats.averageScore}%`} icon={Trophy} trend={3} />
          <StatCard title="Day Streak" value={stats.streak} subtitle="Keep it up!" icon={Flame} />
        </div>

        {/* Quick practice + Performance */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subjects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-foreground">Quick Practice</h2>
              <Link to="/practice">
                <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map(s => (
                <Link key={s.id} to="/practice" className="bg-card rounded-xl p-4 shadow-card border border-border hover:shadow-elevated transition-all group cursor-pointer">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <p className="font-medium text-sm text-card-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.subjectPerformance.find(sp => sp.subject === s.name)?.tests ?? 0} tests taken
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-foreground">Focus Areas</h2>
              <Link to="/study-plan">
                <Button variant="ghost" size="sm">View Plan <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
            <div className="space-y-3">
              {stats.weaknesses.slice(0, 4).map(w => (
                <div key={w.topic} className="bg-card rounded-xl p-4 shadow-card border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-card-foreground">{w.topic}</p>
                      <p className="text-xs text-muted-foreground">{w.subject}</p>
                    </div>
                    <span className="text-sm font-semibold text-destructive">{w.accuracy}%</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive/70 rounded-full" style={{ width: `${w.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rank */}
        <div className="mt-6 gradient-hero rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/70 text-sm">Your School Rank</p>
            <p className="text-3xl font-heading font-bold text-primary-foreground">#{stats.rank} <span className="text-base font-normal text-primary-foreground/60">of {stats.totalStudents}</span></p>
          </div>
          <Link to="/leaderboard">
            <Button variant="outline-hero" size="sm">View Leaderboard</Button>
          </Link>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;