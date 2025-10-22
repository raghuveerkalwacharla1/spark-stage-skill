import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Mic, Briefcase, ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const features = [
    {
      icon: Video,
      title: "Content Creation",
      description: "Create professional videos with templates and editing tools",
      link: "/content-creation",
      color: "content",
    },
    {
      icon: Mic,
      title: "Public Speaking",
      description: "AI-powered speaking practice with real-time feedback",
      link: "/public-speaking",
      color: "speaking",
    },
    {
      icon: Briefcase,
      title: "Interview Prep",
      description: "Master interviews with mock sessions and question banks",
      link: "/interview-prep",
      color: "interview",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: TrendingUp },
    { label: "Practice Sessions", value: "50K+", icon: Target },
    { label: "Success Rate", value: "94%", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-5 z-0" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Master Your Professional Skills
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              All-in-one platform for content creation, public speaking, and interview preparation. 
              Powered by AI to accelerate your growth.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2 bg-gradient-primary hover:opacity-90">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Three Powerful Platforms, One Goal</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to excel in your professional journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={idx} 
                className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 bg-gradient-card"
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 text-${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    asChild 
                    className={`w-full gap-2 bg-${feature.color} hover:bg-${feature.color}/90`}
                  >
                    <Link to={feature.link}>
                      Explore <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Level Up?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already accelerating their career growth with SkillForge
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Start Your Journey <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
