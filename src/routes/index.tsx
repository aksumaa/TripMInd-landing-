import { createFileRoute } from "@tanstack/react-router";
import { I18nProvider } from "@/lib/i18n";
import { Nav, Hero, Problem, Workspace, GlobeExperience, Stages } from "@/components/landing/SectionsTop";
import { Planner, Trust, Adapt, Tours, Compare, Ecosystem, Roadmap, FinalCta, Footer } from "@/components/landing/SectionsBottom";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TripMind — One intelligent workspace for every journey" },
      { name: "description", content: "TripMind is an AI travel operating system: discover destinations, plan trips, compare Ready Tours, travel and adapt in one workspace." },
      { property: "og:title", content: "TripMind — AI travel operating system" },
      { property: "og:description", content: "Discover. Plan. Compare. Travel. Adapt. One intelligent workspace for every journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <I18nProvider>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Workspace />
        <GlobeExperience />
        <Stages />
        <Planner />
        <Trust />
        <Adapt />
        <Tours />
        <Compare />
        <Ecosystem />
        <Roadmap />
        <FinalCta />
      </main>
      <Footer />
    </I18nProvider>
  );
}
