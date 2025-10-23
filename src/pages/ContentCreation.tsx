import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, FileVideo, Scissors, Sparkles, Play, Download, CheckCircle, Palette, Wand2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ContentCreation = () => {
  const templates = [
    { title: "YouTube Tutorial", duration: "10-15 min", icon: Video, color: "content" },
    { title: "Social Media Short", duration: "30-60 sec", icon: Sparkles, color: "content" },
    { title: "Product Demo", duration: "5-8 min", icon: Play, color: "content" },
    { title: "Course Module", duration: "15-20 min", icon: FileVideo, color: "content" },
  ];

  const steps = [
    { 
      title: "Plan Your Content", 
      desc: "Define your message and target audience", 
      icon: "📋",
      tools: [
        { name: "Content Brief Template", desc: "Structure your ideas effectively" },
        { name: "Audience Analyzer", desc: "Understand who you're creating for" },
        { name: "Script Generator", desc: "AI-powered script writing assistance" }
      ]
    },
    { 
      title: "Choose a Template", 
      desc: "Select from our professionally designed templates", 
      icon: "🎨",
      tools: [
        { name: "Template Library", desc: "100+ professional video templates" },
        { name: "Style Customizer", desc: "Adjust colors, fonts, and layouts" },
        { name: "Brand Kit", desc: "Save your brand colors and logos" }
      ]
    },
    { 
      title: "Record & Edit", 
      desc: "Use our intuitive editing tools", 
      icon: "🎬",
      tools: [
        { name: "Screen Recorder", desc: "Capture your screen and webcam" },
        { name: "Video Trimmer", desc: "Cut and arrange clips precisely" },
        { name: "Transition Effects", desc: "Smooth scene transitions" },
        { name: "Audio Mixer", desc: "Balance voice and background music" }
      ]
    },
    { 
      title: "Export & Share", 
      desc: "Download in multiple formats", 
      icon: "📤",
      tools: [
        { name: "Multi-Format Export", desc: "MP4, MOV, WebM formats" },
        { name: "Quality Optimizer", desc: "Optimize for different platforms" },
        { name: "Direct Upload", desc: "Share to YouTube, Vimeo instantly" }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Video className="w-10 h-10 text-content" />
            Content Creation Studio
          </h1>
          <p className="text-muted-foreground text-lg">
            Create professional videos with ease using our templates and editing tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templates.map((template, idx) => {
            const Icon = template.icon;
            return (
              <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-content cursor-pointer bg-gradient-card">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-content/10 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-content" />
                  </div>
                  <CardTitle>{template.title}</CardTitle>
                  <CardDescription>{template.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-content hover:bg-content/90">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="w-6 h-6 text-content" />
              Getting Started Guide
            </CardTitle>
            <CardDescription>Click on each step to explore tools and features</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {steps.map((step, idx) => (
                <AccordionItem key={idx} value={`step-${idx}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
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
                          <CheckCircle className="w-5 h-5 text-content flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-sm text-muted-foreground">{tool.desc}</p>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full mt-4 bg-content hover:bg-content/90">
                        Start This Step
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>Editing Tools</CardTitle>
              <CardDescription>Professional features at your fingertips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-secondary transition-colors">
                <Scissors className="w-5 h-5 text-content" />
                <div>
                  <p className="font-medium">Trim & Cut</p>
                  <p className="text-sm text-muted-foreground">Precise editing tools</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-secondary transition-colors">
                <Sparkles className="w-5 h-5 text-content" />
                <div>
                  <p className="font-medium">AI Effects</p>
                  <p className="text-sm text-muted-foreground">Auto-enhance your content</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-secondary transition-colors">
                <Download className="w-5 h-5 text-content" />
                <div>
                  <p className="font-medium">Export Options</p>
                  <p className="text-sm text-muted-foreground">Multiple formats supported</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Make your content stand out</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-background border-l-4 border-content">
                <p className="font-medium mb-1">Hook viewers in first 3 seconds</p>
                <p className="text-sm text-muted-foreground">Start with a compelling question or statement</p>
              </div>
              <div className="p-3 rounded-lg bg-background border-l-4 border-content">
                <p className="font-medium mb-1">Use good lighting</p>
                <p className="text-sm text-muted-foreground">Natural light or a ring light improves quality</p>
              </div>
              <div className="p-3 rounded-lg bg-background border-l-4 border-content">
                <p className="font-medium mb-1">Keep it concise</p>
                <p className="text-sm text-muted-foreground">Respect your audience's time</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentCreation;
