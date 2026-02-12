import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Eye, EyeOff, GraduationCap, School } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { registerStudent, registerTeacher } from "../api"; // Assuming there's a registerTeacher function

const Register = () => {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: "",
    stream: "",
    schoolName: "",
    schoolLocation: "",
    subjectsTaught: "",
    teachingExperience: "",
    description: ""
  });
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    try {
      if (role === "student") {
        // Student registration
        const studentData = {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          grade: parseInt(formData.grade),
          stream: formData.stream,
          school: {
            name: formData.schoolName,
            location: formData.schoolLocation
          }
        };

        const response = await registerStudent(studentData);
        if (response.success) {
          toast({ title: "Success", description: "Student account created successfully!" });
          setTimeout(() => window.location.href = "/dashboard", 1000);
        } else {
          throw new Error(response.message || "Registration failed");
        }
      } else {
        // Teacher registration
        const teacherData = {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          school: {
            name: formData.schoolName,
            location: formData.schoolLocation
          },
          subjects: formData.subjectsTaught.split(",").map(subject => subject.trim()),
          experience: parseInt(formData.teachingExperience),
          description: formData.description
        };

        // Assuming there's a registerTeacher API function
        // If not available, we'll use the same registerStudent function with a role parameter
        const response = await registerStudent({...teacherData, role: "teacher"});
        if (response.success) {
          toast({ title: "Success", description: "Teacher account created successfully!" });
          setTimeout(() => window.location.href = "/dashboard", 1000);
        } else {
          throw new Error(response.message || "Registration failed");
        }
      }
    } catch (error) {
      toast({ 
        title: "Registration Failed", 
        description: error.message || "An error occurred during registration",
        variant: "destructive"
      });
    }
  };

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
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${role === "student" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
            >
              <GraduationCap className={`w-5 h-5 ${role === "student" ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-left">
                <p className={`font-medium text-sm ${role === "student" ? "text-foreground" : "text-muted-foreground"}`}>Student</p>
                <p className="text-xs text-muted-foreground">Take practice tests</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${role === "teacher" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
            >
              <School className={`w-5 h-5 ${role === "teacher" ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-left">
                <p className={`font-medium text-sm ${role === "teacher" ? "text-foreground" : "text-muted-foreground"}`}>Teacher</p>
                <p className="text-xs text-muted-foreground">Create questions</p>
              </div>
            </button>
          </div>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input 
                  name="firstName" 
                  placeholder="Abebe" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input 
                  name="lastName" 
                  placeholder="Tadesse" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                name="email"
                placeholder="you@example.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input 
                type="password" 
                name="confirmPassword"
                placeholder="••••••••" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>

            {role === "student" && (
              <>
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Select value={formData.grade} onValueChange={(value) => handleSelectChange("grade", value)} required>
                    <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {parseInt(formData.grade) >= 11 && (
                  <div className="space-y-2">
                    <Label>Academic Stream</Label>
                    <Select value={formData.stream} onValueChange={(value) => handleSelectChange("stream", value)} required>
                      <SelectTrigger><SelectValue placeholder="Select stream" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Natural Science</SelectItem>
                        <SelectItem value="social">Social Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            {role === "teacher" && (
              <>
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input 
                    name="schoolName" 
                    placeholder="Unity Academy" 
                    value={formData.schoolName}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>School Location</Label>
                  <Input 
                    name="schoolLocation" 
                    placeholder="Addis Ababa" 
                    value={formData.schoolLocation}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subjects Taught</Label>
                  <Input 
                    name="subjectsTaught" 
                    placeholder="Mathematics, Physics" 
                    value={formData.subjectsTaught}
                    onChange={handleChange}
                    required 
                  />
                  <p className="text-xs text-muted-foreground">Separate multiple subjects with commas</p>
                </div>
                <div className="space-y-2">
                  <Label>Teaching Experience (Years)</Label>
                  <Input 
                    type="number" 
                    name="teachingExperience"
                    placeholder="5" 
                    min="0" 
                    value={formData.teachingExperience}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Brief Description</Label>
                  <Textarea 
                    name="description"
                    placeholder="Tell us about your teaching experience..." 
                    rows={3} 
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;