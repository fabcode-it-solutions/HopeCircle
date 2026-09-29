import { createClient } from "@/lib/supabase/server"
import type { Campaign } from "@/lib/types"
import { CampaignCard } from "@/components/campaign-card"
import { Button } from "@/components/ui/button"
import { TrustBadges } from "@/components/trust-badges"
import {
  Heart,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Shield,
  Award,
  Clock,
  Star,
  Quote,
  Mail,
  ChevronRight,
  Sparkles,
  Target,
  Rocket,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                <span className="text-muted-foreground">🎉 Join 15,000+ donors making an impact</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                  Transform Lives with{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Every Donation
                  </span>
                </h1>
                <p className="text-pretty text-lg text-muted-foreground md:text-xl leading-relaxed">
                  Join a community of changemakers supporting verified causes worldwide. 100% secure, transparent, and
                  impactful. Your generosity creates lasting change.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" asChild className="gap-2 h-12 px-8 shadow-lg hover:shadow-xl transition-shadow">
                  <Link href="#campaigns">
                    <Heart className="h-5 w-5" />
                    Explore Campaigns
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2 h-12 px-8 bg-transparent">
                  <Link href="/admin">
                    Start a Campaign
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Verified campaigns</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Instant impact</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted shadow-2xl">
                <Image
                  src="/diverse-group-of-happy-people-volunteering-and-hel.jpg"
                  alt="People making a difference together"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl border bg-card p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">$2.5M+</div>
                    <div className="text-sm text-muted-foreground">Raised This Year</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 rounded-xl border bg-card p-4 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">98%</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative border-b bg-gradient-to-b from-background via-muted/20 to-background py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-grid-slate-700/25" />
        <div className="container relative mx-auto px-4">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Trusted by thousands worldwide
            </p>
          </div>
          <TrustBadges />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">256-bit SSL Encryption</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Military-grade security protects every transaction
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Verified Organizations</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every campaign thoroughly vetted and approved
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Money-Back Guarantee</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Full refund if campaign doesn't meet standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black_20%,black_80%,transparent)] dark:bg-grid-slate-700/25" />
        <div className="container relative mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Our Impact in Numbers
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Making Real Change Together
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Large featured stat */}
            <div className="md:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 p-4 shadow-xl mb-6">
                    <TrendingUp className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="text-6xl md:text-7xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                    $2.5M+
                  </div>
                  <div className="text-xl font-semibold text-foreground mb-2">Total Funds Raised</div>
                  <p className="text-muted-foreground leading-relaxed">
                    Every dollar goes directly to verified campaigns, creating measurable impact in communities
                    worldwide
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm text-primary font-medium">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span>+$50K this week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smaller stat cards */}
            <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">15K+</div>
                <div className="text-sm font-medium text-muted-foreground">Active Donors</div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">250+</div>
                <div className="text-sm font-medium text-muted-foreground">Active Campaigns</div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-3 shadow-lg mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">50+</div>
                <div className="text-sm font-medium text-muted-foreground">Countries Reached</div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">98%</div>
                <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section id="campaigns" className="border-b py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20" />
        <div className="container relative mx-auto px-4">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                <Rocket className="h-4 w-4" />
                Featured Campaigns
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Causes That Need You
              </h2>
              <p className="mt-3 text-pretty text-muted-foreground text-lg max-w-2xl">
                Every campaign is verified and making real impact. Choose a cause that resonates with your values.
              </p>
            </div>
            <Button size="lg" variant="outline" asChild className="gap-2 bg-card shrink-0">
              <Link href="#campaigns">
                View All Campaigns
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {campaigns && campaigns.length > 0 ? (
            <>
              <div className="mb-8">
                <div className="group relative overflow-hidden rounded-3xl border bg-card shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                      <Image
                        src={`National-Assistance-Dog-Day-2.webp?key=yp1ey&height=600&width=800&query=${encodeURIComponent(campaigns[0].title + " campaign impact")}`}
                        alt={campaigns[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </div>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <div className="mb-4">
                          <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium">
                            {campaigns[0].category || "Community"}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                          {campaigns[0].title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                          {campaigns[0].description}
                        </p>

                        {/* Progress */}
                        <div className="mb-6">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-semibold text-foreground">
                              ${campaigns[0].current_amount?.toLocaleString() || 0} raised
                            </span>
                            <span className="text-muted-foreground">
                              of ${campaigns[0].goal_amount?.toLocaleString() || 0}
                            </span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  ((campaigns[0].current_amount || 0) / (campaigns[0].goal_amount || 1)) * 100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Button size="lg" asChild className="flex-1 shadow-lg">
                          <Link href={`/campaign/${campaigns[0].slug}`}>
                            <Heart className="h-5 w-5 mr-2" />
                            Donate Now
                          </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                          <Link href={`/campaign/${campaigns[0].slug}`}>Learn More</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.slice(1).map((campaign: Campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed p-12 text-center bg-muted/30">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No active campaigns at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-b py-20 bg-gradient-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-grid-slate-700/25" />
        <div className="container relative mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-yellow-500/10 px-4 py-1.5 text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-4">
              <Star className="h-4 w-4 fill-current" />
              4.9/5 from 2,500+ reviews
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Loved by Donors Worldwide
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground text-lg">
              Real stories from people making a difference
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Large testimonial */}
            <div className="lg:row-span-2 group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-card to-muted/30 p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
              <div className="relative h-full flex flex-col">
                <div className="mb-6 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-12 w-12 text-primary/20 mb-6" />
                <p className="text-lg text-foreground leading-relaxed mb-8 flex-1">
                  "This platform made it so easy to support causes I care about. The transparency and regular updates
                  give me confidence that my donations are making a real impact. I've set up monthly donations to three
                  campaigns and love seeing the progress."
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image src="/professional-woman-smiling.png" alt="Sarah Johnson" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Monthly Donor • 2 years</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular testimonials */}
            <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "I've donated to several campaigns and love seeing the progress updates. It's incredible to see how my
                  small contribution adds up with others."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-lg">
                    MC
                  </div>
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">Regular Supporter</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "The security and ease of use are outstanding. I feel confident knowing my payment information is
                  protected, and the recurring donation feature makes giving effortless."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg">
                    EP
                  </div>
                  <div>
                    <div className="font-semibold">Emily Parker</div>
                    <div className="text-sm text-muted-foreground">Recurring Donor</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "Finally, a donation platform that's transparent and trustworthy. I can see exactly where my money
                  goes and the real impact it creates."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold shadow-lg">
                    DM
                  </div>
                  <div>
                    <div className="font-semibold">David Martinez</div>
                    <div className="text-sm text-muted-foreground">First-time Donor</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "The best part is getting updates on the campaigns I support. It feels personal and shows that every
                  donation truly matters."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-lg">
                    LW
                  </div>
                  <div>
                    <div className="font-semibold">Lisa Wang</div>
                    <div className="text-sm text-muted-foreground">Active Donor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container relative mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Zap className="h-4 w-4" />
              Simple & Secure Process
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Start Making Impact in 3 Easy Steps
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground text-lg">
              From browsing to impact, your journey takes just minutes
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute top-10 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-green-500 hidden lg:block"
              style={{ top: "80px" }}
            />

            <div className="grid gap-12 md:grid-cols-3 relative">
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <div className="text-5xl font-bold">1</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-xl bg-card border shadow-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold">Choose Your Cause</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  Browse verified campaigns across categories. Every campaign is thoroughly vetted for authenticity and
                  impact potential.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <div className="text-5xl font-bold">2</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-xl bg-card border shadow-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold">Donate Securely</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  Choose your amount and payment method. Support with one-time or recurring donations using Stripe,
                  PayPal, or Square.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <div className="text-5xl font-bold">3</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-xl bg-card border shadow-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-bold">Track Your Impact</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  Receive real-time updates on campaign progress. See exactly how your generosity creates lasting
                  change.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" asChild className="gap-2 h-14 px-10 shadow-xl text-lg">
              <Link href="#campaigns">
                <Rocket className="h-5 w-5" />
                Get Started Now
              </Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No signup required to donate • Takes less than 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section
        id="impact"
        className="border-b py-20 bg-gradient-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black_10%,black_90%,transparent)] dark:bg-grid-slate-700/25" />
        <div className="container relative mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Award className="h-4 w-4" />
              Why Donors Choose Us
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              The Most Trusted Donation Platform
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground text-lg max-w-2xl mx-auto">
              We've built the infrastructure for transparent, impactful giving that donors and organizations love
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Large feature card */}
            <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/5 via-card to-card p-10 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 p-4 shadow-xl mb-6">
                    <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">100% Transparent</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                    Every donation is tracked and verified. See exactly where your money goes and the impact it creates
                    with detailed, real-time reporting.
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Real-time tracking</span>
                  </div>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border shadow-xl">
                  <Image src="/transparent-donation-tracking-dashboard.jpg" alt="Transparent tracking" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* Regular feature cards */}
            <div className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Impact</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Funds are delivered quickly to campaigns, ensuring your donation makes an immediate difference when it
                  matters most.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg mb-6">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Global Reach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Support campaigns worldwide and connect with causes that matter to you, wherever they are, in over 50
                  countries.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Bank-Level Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your payment information is protected with industry-leading encryption. We never store your card
                  details.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-3 shadow-lg mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Verified Campaigns</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every campaign is thoroughly vetted before going live. Donate with confidence to legitimate causes.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-3 shadow-lg mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community Driven</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join 15,000+ donors who share your passion for making the world better through collective action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground text-lg">Everything you need to know about donating</p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold">Is my donation secure?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Absolutely. We use bank-level encryption and partner with trusted payment processors like Stripe,
                PayPal, and Square. Your payment information is never stored on our servers.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold">Can I set up recurring donations?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes! You can choose to make your donation recurring on a monthly basis. You can cancel or modify your
                recurring donation at any time from your account dashboard.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold">How do I know my donation is making an impact?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every campaign provides regular updates on progress and impact. You'll receive email notifications when
                campaigns you've supported reach milestones or complete their goals.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold">Are donations tax-deductible?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tax-deductibility depends on the specific campaign and your location. Check the campaign details for tax
                information, and we'll provide receipts for all donations.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold">What payment methods do you accept?</h3>
              <p className="text-muted-foreground leading-relaxed">
                We accept all major credit cards, debit cards, PayPal, and digital wallets through our secure payment
                partners Stripe, PayPal, and Square.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
              <Mail className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">Stay Updated</h2>
            <p className="mt-4 text-pretty text-muted-foreground text-lg">
              Get inspiring stories, campaign updates, and impact reports delivered to your inbox
            </p>
            <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Input type="email" placeholder="Enter your email" className="h-12 flex-1" required />
              <Button type="submit" size="lg" className="h-12 px-8 shadow-lg">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-12 text-center md:p-16 shadow-xl">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(white,rgba(255,255,255,0.5))] dark:bg-grid-slate-700/25" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                Ready to Make a Difference?
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground md:text-xl">
                Join thousands of donors who are creating positive change in the world. Your generosity can transform
                lives starting today.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild className="gap-2 h-12 px-8 shadow-lg hover:shadow-xl transition-shadow">
                  <Link href="#campaigns">
                    <Heart className="h-5 w-5" />
                    Start Giving Today
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 bg-card">
                  <Link href="/admin">Create Your Campaign</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>No hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>100% secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
