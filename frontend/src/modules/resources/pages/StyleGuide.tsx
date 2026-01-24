import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const StyleGuide = () => {
  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Style Guide</h1>
        <p className="text-xl text-muted-foreground">
          Design system and component patterns for Hire XO.
        </p>
      </div>

      {/* Colors */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-20 w-full bg-primary rounded-xl shadow-lg shadow-primary/20" />
            <p className="text-sm font-bold">Primary</p>
            <p className="text-xs text-muted-foreground">#2563eb (Blue 600)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-slate-900 rounded-xl" />
            <p className="text-sm font-bold">Dark Background</p>
            <p className="text-xs text-muted-foreground">#0f172a (Slate 900)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-accent rounded-xl" />
            <p className="text-sm font-bold">Accent</p>
            <p className="text-xs text-muted-foreground">Indigo 50</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-background border rounded-xl" />
            <p className="text-sm font-bold">Background</p>
            <p className="text-xs text-muted-foreground">#f8fafc</p>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="font-black text-primary">Aa</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Typography</h2>
        </div>
        <div className="grid gap-6 p-8 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Heading 1
            </p>
            <h1 className="text-4xl font-black tracking-tighter">The quick brown fox jumps</h1>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Heading 2
            </p>
            <h2 className="text-2xl font-black tracking-tight">The quick brown fox jumps</h2>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Body Bold
            </p>
            <p className="text-base font-bold text-slate-600 dark:text-slate-400">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="font-black text-primary">C</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Core Components</h2>
        </div>
        <div className="grid gap-8 p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Buttons
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="rounded-2xl h-12 px-8 font-black">Primary Button</Button>
              <Button variant="secondary" className="rounded-2xl h-12 px-8 font-black">
                Secondary
              </Button>
              <Button variant="outline" className="rounded-2xl h-12 px-8 font-black">
                Outline
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Badges
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Featured
              </Badge>
              <Badge
                variant="secondary"
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                New
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                Urgent
              </Badge>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4 max-w-md">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Inputs
            </p>
            <Input placeholder="Enter your text..." />
            <p className="text-xs text-muted-foreground">
              Focus state includes a soft indigo ring.
            </p>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Cards
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="active:border-primary/50 active:shadow-xl cursor-pointer overflow-hidden relative active:scale-[0.98] transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Tap this card to see the feedback.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-black">
                    Cards feature touch feedback, rounded corners, and smooth transitions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Static Card</CardTitle>
                  <CardDescription>Standard card layout.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Used for displaying static information without interaction.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Accessibility</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>Color contrast ratios meet WCAG 2.1 AA standards (4.5:1 for normal text).</li>
          <li>All interactive elements have clear focus-visible states.</li>
          <li>Semantic HTML tags are used throughout the application.</li>
          <li>Aria-labels and roles are implemented where necessary.</li>
        </ul>
      </section>
    </div>
  );
};

export default StyleGuide;
