import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, GraduationCap, School } from "lucide-react";
import RegistrationForm from "@/components/RegistrationForm";

const Register = () => {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 60%, white 1px, transparent 1px)", backgroundSize: "25px 25px" }} />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-primary-foreground">Join ExamPrep</h2>
          <p className="text-primary-foreground/70 mt-4">Start your journey towards academic excellence with adaptive learning.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">ExamPrep</span>
          </Link>

          <h1 className="text-2xl font-heading font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Choose your role to get started</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                role === "student" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <GraduationCap className={`w-5 h-5 ${
                role === "student" ? "text-primary" : "text-muted-foreground"
              }`} />
              <div className="text-left">
                <p className={`font-medium text-sm ${
                  role === "student" ? "text-foreground" : "text-muted-foreground"
                }`}>Student</p>
                <p className="text-xs text-muted-foreground">Take practice tests</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                role === "teacher" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <School className={`w-5 h-5 ${
                role === "teacher" ? "text-primary" : "text-muted-foreground"
              }`} />
              <div className="text-left">
                <p className={`font-medium text-sm ${
                  role === "teacher" ? "text-foreground" : "text-muted-foreground"
                }`}>Teacher</p>
                <p className="text-xs text-muted-foreground">Create questions</p>
              </div>
            </button>
          </div>

          {/* Registration form */}
          <div className="mt-6">
            <RegistrationForm role={role} />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;