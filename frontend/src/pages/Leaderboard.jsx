import DashboardLayout from "@/components/DashboardLayout";
import { leaderboard } from "@/lib/mock-data";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Leaderboard = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">See how you compare with other students</p>
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-lg mx-auto">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
            const isFirst = i === 1;
            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn("text-center", isFirst && "-mt-4")}
              >
                <div className={cn(
                  "rounded-xl p-4 border shadow-card",
                  isFirst ? "gradient-hero border-transparent" : "bg-card border-border"
                )}>
                  <div className={cn("text-3xl mb-2", isFirst && "text-4xl")}>
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                  </div>
                  <p className={cn("font-heading font-bold text-sm truncate", isFirst ? "text-primary-foreground" : "text-card-foreground")}>
                    {entry.name.split(" ")[0]}
                  </p>
                  <p className={cn("text-lg font-heading font-bold mt-1", isFirst ? "text-primary-foreground" : "text-card-foreground")}>
                    {entry.score}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Student</div>
            <div className="col-span-3">School</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-1 text-right">Δ</div>
          </div>
          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className={cn("grid grid-cols-12 gap-2 px-4 py-3 items-center border-t border-border text-sm", entry.name === "Abebe Tadesse" && "bg-primary/5")}
            >
              <div className="col-span-1 font-heading font-bold text-muted-foreground">{entry.rank}</div>
              <div className="col-span-5 font-medium text-card-foreground truncate">
                {entry.name}
                {entry.name === "Abebe Tadesse" && <span className="ml-2 text-xs text-primary">(You)</span>}
              </div>
              <div className="col-span-3 text-muted-foreground truncate">{entry.school}</div>
              <div className="col-span-2 text-right font-heading font-bold text-card-foreground">{entry.score}</div>
              <div className="col-span-1 flex justify-end">
                {entry.change > 0 && <TrendingUp className="w-4 h-4 text-success" />}
                {entry.change < 0 && <TrendingDown className="w-4 h-4 text-destructive" />}
                {entry.change === 0 && <Minus className="w-4 h-4 text-muted-foreground" />}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Leaderboard;