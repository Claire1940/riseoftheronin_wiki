"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  Cpu,
  Crosshair,
  Flag,
  Gauge,
  Hammer,
  Heart,
  Layers,
  Map,
  MapPin,
  MessageCircle,
  Package,
  Scroll,
  Shield,
  Sparkles,
  Star,
  Swords,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 8 模块 section ID —— Tools Grid 卡片锚点一一对应（点击平滑滚动）
const SECTION_IDS = [
  "beginner-guide",
  "weapons-tier-list",
  "combat-styles-counterspark",
  "best-builds-skills-gear",
  "pc-requirements-performance-updates",
  "walkthrough-missions-bosses",
  "bonds-romance-story-choices",
  "multiplayer-co-op-guide",
];

// 武器属性 label 友好化
const STAT_LABELS: Record<string, string> = {
  damage: "Damage",
  speed: "Speed",
  range: "Range",
  kiPressure: "Ki Pressure",
  easeOfUse: "Ease of Use",
  bossValue: "Boss Value",
};

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale: _locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.riseoftheronin.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Rise of the Ronin Wiki",
        description:
          "Explore Rise of the Ronin builds, best weapons, combat styles, bond missions, romance choices, endings, collectibles, bosses, maps and PC performance tips.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Rise of the Ronin - Bakumatsu Open-World Samurai RPG",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Rise of the Ronin Wiki",
        alternateName: "Rise of the Ronin",
        url: siteUrl,
        description:
          "Rise of the Ronin Wiki resource hub for builds, weapons, combat styles, bonds, missions, choices, endings and PC performance guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Rise of the Ronin Wiki - Bakumatsu Samurai RPG",
        },
        sameAs: [
          "https://store.steampowered.com/app/1340990/Rise_of_the_Ronin/",
          "https://steamcommunity.com/app/1340990",
          "https://www.reddit.com/r/riseoftheronin/",
          "https://www.youtube.com/@PlayStation",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Rise of the Ronin",
        gamePlatform: ["PlayStation 5", "PC"],
        applicationCategory: "Game",
        genre: ["Action RPG", "Open World", "Samurai", "Adventure"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 3,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/1340990/Rise_of_the_Ronin/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Rise of the Ronin - Pre-Order Trailer",
        description:
          "Official Rise of the Ronin pre-order trailer showcasing Bakumatsu-era open-world samurai action and combat.",
        uploadDate: "2024-02-13",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/zS8EvlTGCiE",
        url: "https://www.youtube.com/watch?v=zS8EvlTGCiE",
      },
    ],
  };

  // Co-op accordion state（模块 8）
  const [coopExpanded, setCoopExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // 模块内卡片轮换图标（每张卡片不同图标）
  const mechanicIcons = [Zap, Sparkles, Swords, Star, Target, Shield, Crosshair, Layers];
  const buildIcons = [Hammer, Shield, Crosshair, Target, Gauge, Package];
  const bondIcons = [Heart, MapPin, Users, MessageCircle, Star, Flag, Scroll];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/1340990/Rise_of_the_Ronin/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* ===== Video Section（IntersectionObserver 自动播放）===== */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="zS8EvlTGCiE"
              title="Rise of the Ronin - Pre-Order Trailer | PS5"
            />
          </div>
        </div>
      </section>

      {/* ===== Tools Grid - 8 Navigation Cards（模块导航区，位于视频区之后）===== */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = SECTION_IDS[index];
              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(sectionId);
                  }}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Latest Updates ===== */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={_locale}
        max={12}
      />

      {/* ===== Module 1: Beginner Guide（step-by-step）===== */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Compass className="h-6 w-6" />}
            title={t.modules.beginnerGuide.title}
            intro={t.modules.beginnerGuide.intro}
          />

          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {step.actions?.map((a: string, ai: number) => (
                      <li key={ai} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{a}</span>
                      </li>
                    ))}
                  </ul>
                  {step.result && (
                    <div className="mt-3 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)] text-sm">
                      <span className="font-semibold text-[hsl(var(--nav-theme-light))]">
                        Result:{" "}
                      </span>
                      <span className="text-muted-foreground">{step.result}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.beginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* ===== Module 2: Weapons Tier List（tier-grid）===== */}
      <section id="weapons-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Swords className="h-6 w-6" />}
            title={t.modules.weaponsTierList.title}
            intro={t.modules.weaponsTierList.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.weaponsTierList.weapons.map((w: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">{w.name}</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[hsl(var(--nav-theme))] text-white">
                    {w.tier === "S" && <Star className="w-3 h-3" fill="currentColor" />}
                    Tier {w.tier}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
                  {Object.entries(w.stats).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{STAT_LABELS[key] || key}</span>
                      <span className="font-medium">{val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground/90">Best for: </span>
                  {w.bestFor}
                </p>
                <p className="text-sm text-muted-foreground">{w.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 3: Combat Styles & Counterspark（matchup + mechanics）===== */}
      <section id="combat-styles-counterspark" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Zap className="h-6 w-6" />}
            title={t.modules.combatStylesCounterspark.title}
            intro={t.modules.combatStylesCounterspark.intro}
          />

          {/* Styles */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {t.modules.combatStylesCounterspark.styles.map((s: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center">
                    <span className="font-bold text-[hsl(var(--nav-theme-light))]">{s.name}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{s.name} Style</h3>
                    <p className="text-xs text-muted-foreground">Meaning: {s.meaning}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground/90">Effective vs: </span>
                    {s.effectiveAgainst}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground/90">Weak vs: </span>
                    {s.weakAgainst}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground/90">Use: </span>
                    {s.recommendedUse}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mechanics */}
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">Combat Mechanics</h3>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.combatStylesCounterspark.mechanics.map((m: any, index: number) => {
              const Icon = mechanicIcons[index % mechanicIcons.length];
              return (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <h4 className="font-bold">{m.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground/90">Input: </span>
                    {m.input}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">{m.function}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground/90">Timing: </span>
                    {m.bestTiming}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Tip: </span>
                    {m.advancedTip}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Module 4: Best Builds, Skills & Gear（build cards）===== */}
      <section id="best-builds-skills-gear" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Hammer className="h-6 w-6" />}
            title={t.modules.bestBuildsSkillsGear.title}
            intro={t.modules.bestBuildsSkillsGear.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.bestBuildsSkillsGear.builds.map((b: any, index: number) => {
              const Icon = buildIcons[index % buildIcons.length];
              return (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <h3 className="font-bold">{b.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{b.role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {b.primaryTree}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border">
                      {b.secondaryTree}
                    </span>
                    {b.weapons.map((wp: string, wi: number) => (
                      <span key={wi} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border">
                        {wp}
                      </span>
                    ))}
                  </div>
                  <div className="mb-2">
                    <p className="text-xs font-semibold mb-1">Skill priorities</p>
                    <ul className="space-y-1">
                      {b.skillPriorities.map((sp: string, si: number) => (
                        <li key={si} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{sp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-semibold mb-1">Gear priorities</p>
                    <ul className="space-y-1">
                      {b.gearPriorities.map((gp: string, gi: number) => (
                        <li key={gi} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{gp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)] text-xs">
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Combat loop: </span>
                    <span className="text-muted-foreground">{b.combatLoop}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 320×50（模块间停顿）*/}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* ===== Module 5: PC Requirements & Performance（specs tables）===== */}
      <section id="pc-requirements-performance-updates" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Cpu className="h-6 w-6" />}
            title={t.modules.pcRequirementsPerformanceUpdates.title}
            intro={t.modules.pcRequirementsPerformanceUpdates.intro}
          />
          <div className="scroll-reveal space-y-8">
            {t.modules.pcRequirementsPerformanceUpdates.tables.map((table: any, ti: number) => (
              <div key={ti}>
                <h3 className="font-bold text-lg md:text-xl mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--nav-theme))]" />
                  {table.title}
                </h3>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        {table.columns.map((col: string, ci: number) => (
                          <th
                            key={ci}
                            className="border-b border-border p-3 text-left font-semibold bg-white/5 whitespace-nowrap"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row: any, ri: number) => (
                        <tr key={ri} className={ri % 2 === 1 ? "bg-white/[0.02]" : ""}>
                          {table.columnKeys.map((key: string, ki: number) => (
                            <td
                              key={ki}
                              className="border-b border-border/50 p-3 align-top text-muted-foreground"
                            >
                              {row[key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 6: Walkthrough, Missions & Bosses（chapter timeline）===== */}
      <section id="walkthrough-missions-bosses" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Map className="h-6 w-6" />}
            title={t.modules.walkthroughMissionsBosses.title}
            intro={t.modules.walkthroughMissionsBosses.intro}
          />
          <ol className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.walkthroughMissionsBosses.stages.map((s: any, index: number) => (
              <li key={index} className="relative">
                <div className="absolute -left-[1.55rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                      {s.stage}
                    </span>
                    <h3 className="font-bold text-lg">{s.chapter}</h3>
                  </div>
                  <p className="text-xs text-[hsl(var(--nav-theme-light))] font-medium mb-2">{s.region}</p>
                  <p className="text-sm text-muted-foreground mb-4">{s.storyFocus}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <TimelineList label="Key Missions" items={s.keyMissions} />
                    <TimelineList label="Preparation" items={s.preparation} />
                    <TimelineList label="Major Encounters" items={s.majorEncounters} />
                    <TimelineList label="Unlocks" items={s.unlocks} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Module 7: Bonds, Romance & Choices（relationship cards）===== */}
      <section id="bonds-romance-story-choices" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Heart className="h-6 w-6" />}
            title={t.modules.bondsRomanceStoryChoices.title}
            intro={t.modules.bondsRomanceStoryChoices.intro}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.bondsRomanceStoryChoices.bonds.map((b: any, index: number) => {
              const Icon = bondIcons[index % bondIcons.length];
              return (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center">
                      <Icon className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {b.type}
                    </span>
                  </div>
                  <h3 className="font-bold mb-3">{b.title}</h3>
                  <ul className="space-y-1 mb-3">
                    {b.howToProgress.map((h: string, hi: number) => (
                      <li key={hi} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {b.rewards.map((r: string, ri: number) => (
                      <span key={ri} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border">
                        {r}
                      </span>
                    ))}
                  </div>
                  <p className="mt-auto text-xs text-muted-foreground">{b.notes}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Module 8: Multiplayer & Co-op（accordion）===== */}
      <section id="multiplayer-co-op-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Users className="h-6 w-6" />}
            title={t.modules.multiplayerCoOpGuide.title}
            intro={t.modules.multiplayerCoOpGuide.intro}
          />
          <div className="scroll-reveal space-y-2">
            {t.modules.multiplayerCoOpGuide.faqs.map((faq: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-white/5"
              >
                <button
                  onClick={() => setCoopExpanded(coopExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${coopExpanded === index ? "rotate-180 text-[hsl(var(--nav-theme-light))]" : ""}`}
                  />
                </button>
                {coopExpanded === index && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground mb-3">{faq.answer}</p>
                    <ul className="flex flex-wrap gap-2">
                      {faq.details?.map((d: string, di: number) => (
                        <li
                          key={di}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                        >
                          <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/ktfamily"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/riseoftheronin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/1340990"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/1340990/Rise_of_the_Ronin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- 子组件 ---------- */

function ModuleHeader({
  icon,
  title,
  intro,
}: {
  icon: React.ReactNode;
  title: string;
  intro: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="inline-flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
        <span className="text-[hsl(var(--nav-theme-light))]">{icon}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{title}</h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

function TimelineList({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1.5">
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
