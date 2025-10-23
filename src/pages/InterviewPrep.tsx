import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Code, Building2, MessageSquare, CheckCircle2, UserCircle, Target, Mic2, BarChart3 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const InterviewPrep = () => {
  const categories = [
    { title: "Technical Interviews", icon: Code, count: "45 questions", color: "interview" },
    { title: "Behavioral", icon: Users, count: "32 questions", color: "interview" },
    { title: "Leadership", icon: Building2, count: "28 questions", color: "interview" },
    { title: "Case Studies", icon: MessageSquare, count: "15 scenarios", color: "interview" },
  ];

  const commonQuestions = [
    { question: "Tell me about yourself", difficulty: "Easy", answered: true },
    { question: "What are your greatest strengths?", difficulty: "Easy", answered: true },
    { question: "Describe a challenging situation you faced", difficulty: "Medium", answered: false },
    { question: "Where do you see yourself in 5 years?", difficulty: "Medium", answered: true },
  ];

  const industries = [
    { name: "Tech & Software", icon: "💻", templates: 25 },
    { name: "Finance & Banking", icon: "💰", templates: 18 },
    { name: "Healthcare", icon: "🏥", templates: 15 },
    { name: "Marketing", icon: "📱", templates: 20 },
    { name: "Consulting", icon: "📊", templates: 22 },
    { name: "Education", icon: "🎓", templates: 12 },
  ];

  const preparationSteps = [
    {
      title: "Set Up Your Profile",
      desc: "Tell us about your background and goals",
      icon: UserCircle,
      tools: [
        { name: "Resume Parser", desc: "Extract key information from your resume" },
        { name: "Skills Assessment", desc: "Identify your strengths and areas to improve" },
        { name: "Goal Setting", desc: "Define your target roles and companies" }
      ]
    },
    {
      title: "Choose Interview Type",
      desc: "Select the interview format you want to practice",
      icon: Target,
      tools: [
        { name: "Technical Interview", desc: "Coding challenges and system design" },
        { name: "Behavioral Interview", desc: "STAR method and soft skills" },
        { name: "Case Study Interview", desc: "Business problem-solving" },
        { name: "Panel Interview", desc: "Multiple interviewer scenarios" }
      ]
    },
    {
      title: "Practice with AI",
      desc: "Get real-time feedback on your answers",
      icon: Mic2,
      tools: [
        { name: "Voice Recording", desc: "Practice speaking your answers out loud" },
        { name: "AI Interviewer", desc: "Dynamic follow-up questions" },
        { name: "Answer Evaluation", desc: "Get scored on content and delivery" },
        { name: "Sample Answers", desc: "Review high-quality answer examples" }
      ]
    },
    {
      title: "Review & Improve",
      desc: "Analyze your performance and track progress",
      icon: BarChart3,
      tools: [
        { name: "Performance Dashboard", desc: "Visual analytics of your progress" },
        { name: "Weak Areas Report", desc: "Focused improvement suggestions" },
        { name: "Session Recordings", desc: "Review past practice sessions" },
        { name: "Progress Milestones", desc: "Celebrate your achievements" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Briefcase className="w-10 h-10 text-interview" />
            Interview Preparation Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Practice with real interview questions and get AI-powered feedback
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-interview cursor-pointer bg-gradient-card">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-interview/10 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-interview" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.count}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-interview hover:bg-interview/90">
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-interview" />
              Getting Started Guide
            </CardTitle>
            <CardDescription>Click on each step to explore tools and features</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {preparationSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <AccordionItem key={idx} value={`step-${idx}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-interview/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-interview" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4 space-y-3">
                        {step.tools.map((tool, toolIdx) => (
                          <div key={toolIdx} className="flex items-start gap-3 p-3 rounded-lg bg-background hover:bg-secondary transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-interview flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">{tool.name}</p>
                              <p className="text-sm text-muted-foreground">{tool.desc}</p>
                            </div>
                          </div>
                        ))}
                        <Button className="w-full mt-4 bg-interview hover:bg-interview/90">
                          Start This Step
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-interview" />
                Common Interview Questions
              </CardTitle>
              <CardDescription>Master the most frequently asked questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {commonQuestions.map((q, idx) => {
                const getDifficultyColor = (difficulty: string) => {
                  if (difficulty === "Easy") return "bg-green-500/10 text-green-600 border-green-500/20";
                  if (difficulty === "Medium") return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
                  return "bg-red-500/10 text-red-600 border-red-500/20";
                };

                return (
                  <div key={idx} className="p-4 rounded-lg bg-background border border-border hover:border-interview transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium flex-1">{q.question}</p>
                      {q.answered && <CheckCircle2 className="w-5 h-5 text-interview flex-shrink-0" />}
                    </div>
                    <Badge className={getDifficultyColor(q.difficulty)}>{q.difficulty}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-interview" />
                Mock Interview Sessions
              </CardTitle>
              <CardDescription>Simulate real interview environments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-interview/5 border-2 border-interview/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Full Interview Simulation</h4>
                  <Badge className="bg-interview text-interview-foreground">45 min</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Experience a complete interview with AI interviewer, from introduction to closing questions
                </p>
                <Button className="w-full bg-interview hover:bg-interview/90">
                  Schedule Mock Interview
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Recent Practice Stats</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Questions Practiced</span>
                  <span className="font-bold">127</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mock Interviews</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Average Rating</span>
                  <span className="font-bold text-interview">4.2/5.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Industry-Specific Preparation</CardTitle>
            <CardDescription>Tailored questions and answer templates for your field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {industries.map((industry, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2 hover:border-interview hover:bg-interview/5"
                >
                  <span className="text-2xl">{industry.icon}</span>
                  <span className="font-semibold">{industry.name}</span>
                  <span className="text-xs text-muted-foreground">{industry.templates} templates</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewPrep;
