import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockQuestions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, ArrowRight, Clock, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Practice = () => {
  const [state, setState] = useState("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = mockQuestions;
  const question = questions[currentQ];

  const startQuiz = () => {
    setState("active");
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setAnswers([]);
  };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
  };

  const handleSubmitAnswer = () => {
    if (selected === null) return;
    setAnswered(true);
    const correct = selected === question.correctAnswer;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, selected]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setState("result");
    }
  };

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {state === "idle" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📐</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Mathematics Practice</h1>
            <p className="text-muted-foreground mt-2">{questions.length} adaptive questions • Mixed topics</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> ~10 min</span>
            </div>
            <Button onClick={startQuiz} size="xl" className="mt-8">
              Start Practice <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {state === "active" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground font-medium">Question {currentQ + 1} of {questions.length}</span>
              <span className="text-sm text-muted-foreground">{question.topic} • Grade {question.grade}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
              <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-heading font-semibold text-foreground mb-6">{question.question}</h2>
                <div className="space-y-3">
                  {question.options.map((opt, i) => {
                    const isCorrect = i === question.correctAnswer;
                    const isSelected = selected === i;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border-2 transition-all",
                          !answered && isSelected && "border-primary bg-primary/5",
                          !answered && !isSelected && "border-border hover:border-muted-foreground/30",
                          answered && isCorrect && "border-success bg-success/5",
                          answered && isSelected && !isCorrect && "border-destructive bg-destructive/5",
                          answered && !isCorrect && !isSelected && "border-border opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0",
                            !answered && isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                            answered && isCorrect && "bg-success text-success-foreground",
                            answered && isSelected && !isCorrect && "bg-destructive text-destructive-foreground",
                          )}>
                            {answered && isCorrect ? <CheckCircle2 className="w-4 h-4" /> : answered && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-sm font-medium text-card-foreground">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-end">
              {!answered ? (
                <Button onClick={handleSubmitAnswer} disabled={selected === null} size="lg">Submit Answer</Button>
              ) : (
                <Button onClick={handleNext} size="lg">
                  {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {state === "result" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6", percentage >= 70 ? "bg-success/10" : "bg-warning/10")}>
              <span className="text-4xl">{percentage >= 70 ? "🎉" : "💪"}</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              {percentage >= 70 ? "Great Job!" : "Keep Practicing!"}
            </h1>
            <p className="text-4xl font-heading font-bold text-foreground mt-4">{score}/{questions.length}</p>
            <p className="text-muted-foreground mt-1">{percentage}% accuracy</p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Button onClick={startQuiz} variant="outline" size="lg">
                <RotateCcw className="w-4 h-4" /> Try Again
              </Button>
              <Button onClick={() => setState("idle")} size="lg">
                New Practice
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Practice;