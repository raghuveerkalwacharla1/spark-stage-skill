import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Brain, Trophy, TrendingUp, Volume2, Target, Sparkles, PlayCircle, MessageCircle, CheckCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import VoiceInterface from "@/components/VoiceInterface";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PracticeSessionModal } from "@/components/PracticeSessionModal";
import { SessionHistory } from "@/components/SessionHistory";

const PublicSpeaking = () => {
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

  const practices = [
    { title: "Impromptu Speaking", level: "Beginner", time: "5 min", icon: Mic },
    { title: "Persuasive Speech", level: "Intermediate", time: "10 min", icon: Target },
    { title: "Storytelling Practice", level: "Advanced", time: "15 min", icon: Brain },
    { title: "Vocal Variety", level: "All Levels", time: "8 min", icon: Volume2 },
  ];

  const improvements = [
    { metric: "Clarity", score: 83, change: "+12%" },
    { metric: "Confidence", score: 78, change: "+8%" },
    { metric: "Pacing", score: 92, change: "+15%" },
    { metric: "Engagement", score: 88, change: "+10%" },
  ];

  const speakingSteps = [
    {
      title: "Warm-Up Exercises",
      desc: "Prepare your voice and body",
      icon: Sparkles,
      tools: [
        { name: "Vocal Warm-Ups", desc: "Breathing and voice exercises" },
        { name: "Tongue Twisters", desc: "Improve articulation and clarity" },
        { name: "Posture Guide", desc: "Body language for confident speaking" },
        { name: "Energy Boost", desc: "Quick exercises to energize delivery" }
      ]
    },
    {
      title: "Choose Practice Module",
      desc: "Select the type of speaking you want to practice",
      icon: Target,
      tools: [
        { name: "Impromptu Speaking", desc: "Think and speak on the spot" },
        { name: "Persuasive Speech", desc: "Convince and influence your audience" },
        { name: "Storytelling", desc: "Engage with compelling narratives" },
        { name: "Professional Presentations", desc: "Business and formal settings" }
      ]
    },
    {
      title: "Record & Practice",
      desc: "Speak with AI coach listening",
      icon: PlayCircle,
      tools: [
        { name: "Real-Time AI Coach", desc: "Get live feedback as you speak" },
        { name: "Filler Word Detector", desc: "Identify 'um', 'uh', 'like' usage" },
        { name: "Pacing Monitor", desc: "Visual cues for speaking speed" },
        { name: "Confidence Meter", desc: "Track your vocal confidence" }
      ]
    },
    {
      title: "Review AI Feedback",
      desc: "Analyze performance and improve",
      icon: MessageCircle,
      tools: [
        { name: "Detailed Analysis", desc: "Comprehensive feedback report" },
        { name: "Improvement Tips", desc: "Personalized suggestions" },
        { name: "Score Tracking", desc: "Monitor progress over time" },
        { name: "Comparison Tool", desc: "See before and after improvements" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Mic className="w-10 h-10 text-speaking" />
            Public Speaking Lab
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered speaking practice to boost your communication skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {practices.map((practice, idx) => {
            const Icon = practice.icon;
            const getLevelColor = (level: string) => {
              if (level === "Beginner") return "bg-green-500/10 text-green-600 border-green-500/20";
              if (level === "Intermediate") return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
              if (level === "Advanced") return "bg-red-500/10 text-red-600 border-red-500/20";
              return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            };

            return (
              <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-speaking cursor-pointer bg-gradient-card">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-speaking/10 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-speaking" />
                  </div>
                  <CardTitle className="text-lg">{practice.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge className={getLevelColor(practice.level)}>{practice.level}</Badge>
                    <span className="text-sm text-muted-foreground">{practice.time}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-speaking hover:bg-speaking/90"
                    onClick={() => {
                      setSelectedDifficulty(practice.level as 'Beginner' | 'Intermediate' | 'Advanced');
                      setPracticeModalOpen(true);
                    }}
                  >
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
              <Mic className="w-6 h-6 text-speaking" />
              Getting Started Guide
            </CardTitle>
            <CardDescription>Click on each step to explore tools and features</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {speakingSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <AccordionItem key={idx} value={`step-${idx}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-speaking/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-speaking" />
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
                            <CheckCircle className="w-5 h-5 text-speaking flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">{tool.name}</p>
                              <p className="text-sm text-muted-foreground">{tool.desc}</p>
                            </div>
                          </div>
                        ))}
                        <Button className="w-full mt-4 bg-speaking hover:bg-speaking/90">
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
                <Brain className="w-6 h-6 text-speaking" />
                AI Reviewer Insights
              </CardTitle>
              <CardDescription>Real-time feedback on your speaking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-speaking/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-speaking" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Excellent use of pauses</p>
                    <p className="text-sm text-muted-foreground">Your strategic pauses helped emphasize key points effectively</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Work on vocal variety</p>
                    <p className="text-sm text-muted-foreground">Try varying your pitch and tone to maintain audience interest</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-speaking" />
                Your Progress
              </CardTitle>
              <CardDescription>Track your improvement over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {improvements.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.score}%</span>
                      <Badge className="bg-speaking/10 text-speaking border-speaking/20">
                        {item.change}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-speaking h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <SessionHistory />

        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Language Improvement Sessions</CardTitle>
            <CardDescription>Enhance your vocabulary and expression</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:border-speaking hover:bg-speaking/5">
                <span className="text-2xl">📚</span>
                <span className="font-semibold">Word Power</span>
                <span className="text-xs text-muted-foreground">Expand vocabulary</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:border-speaking hover:bg-speaking/5">
                <span className="text-2xl">🎭</span>
                <span className="font-semibold">Expression Practice</span>
                <span className="text-xs text-muted-foreground">Emotional delivery</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:border-speaking hover:bg-speaking/5">
                <span className="text-2xl">🗣️</span>
                <span className="font-semibold">Pronunciation</span>
                <span className="text-xs text-muted-foreground">Clear articulation</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PracticeSessionModal
        open={practiceModalOpen}
        onOpenChange={setPracticeModalOpen}
        difficulty={selectedDifficulty}
      />

      <VoiceInterface />
    </div>
  );
};

export default PublicSpeaking;
