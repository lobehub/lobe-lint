import { createGlobalStyle } from '@lobehub/ui';
import {
  AgentSkillCard,
  FeatureGrid,
  InstallBanner,
  LANDING_GRADIENT_VAR,
  LANDING_PALETTE_DARK,
  LANDING_PALETTE_LIGHT,
  LandingHero,
  type LandingLinkRender,
  type LandingPalette,
  LandingSection,
} from '@lobehub/ui/awesome';
import { GithubIcon } from '@lobehub/ui/icons';
import {
  ArrowRight,
  Blocks,
  BookOpenText,
  GitCommitHorizontal,
  Layers,
  ListChecks,
  SlidersHorizontal,
  Terminal,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const SITE_URL = 'https://lint.lobehub.com';

const landingGradient = ([from, via, to]: LandingPalette) =>
  `linear-gradient(105deg, ${from} 8%, ${via} 55%, ${to} 95%)`;

const LandingAccent = createGlobalStyle`
  :root {
    ${LANDING_GRADIENT_VAR}: ${({ theme }) =>
      landingGradient(theme.isDarkMode ? LANDING_PALETTE_DARK : LANDING_PALETTE_LIGHT)};
  }
`;

const renderLink: LandingLinkRender = ({ external, href, ...props }) =>
  external ? (
    <a href={href} rel="noreferrer" target="_blank" {...props} />
  ) : (
    <Link to={href} {...props} />
  );

const FEATURES = [
  {
    description:
      'Detects your package manager, TypeScript and React framework, then writes every config.',
    href: '/packages/create-lobe-lint',
    icon: Terminal,
    title: 'One command setup',
  },
  {
    description:
      'One defineConfig() covers JavaScript, TypeScript, React, Next.js, Remix, Vite and Expo.',
    href: '/packages/eslint-config',
    icon: Blocks,
    title: 'One ESLint factory',
  },
  {
    description: 'Install configs one by one, or import all of them from @lobehub/lint.',
    href: '/packages/lint',
    icon: Layers,
    title: 'All or just what you need',
  },
  {
    description: 'Start from LobeHub conventions; extra flat configs you pass are applied last.',
    href: '/packages/eslint-config',
    icon: SlidersHorizontal,
    title: 'Easy overrides',
  },
  {
    description:
      'Commitlint checks gitmoji commits, Semantic Release turns them into versions and changelogs.',
    href: '/packages/commitlint-config',
    icon: GitCommitHorizontal,
    title: 'Clean history',
  },
  {
    description: 'Prettier, Stylelint and Remarklint keep code, styles and Markdown consistent.',
    href: '/packages/prettier-config',
    icon: BookOpenText,
    title: 'Code, styles and docs',
  },
];

interface HomePageProps {
  description: string;
  getStartedPathname: string;
}

export default function Home({ description }: HomePageProps) {
  const navigate = useNavigate();

  return (
    <>
      <LandingAccent />
      <LandingHero
        accent="Lint"
        description={<span data-pagefind-meta="description">{description}</span>}
        renderLink={renderLink}
        title={<span data-pagefind-meta="title">Lobe</span>}
        actions={[
          {
            href: '/getting-started',
            icon: ArrowRight,
            iconPlacement: 'end',
            label: 'Get Started',
            primary: true,
          },
          {
            href: '/rules',
            icon: ListChecks,
            label: 'Browse Rules',
          },
          {
            href: 'https://github.com/lobehub/lobe-lint',
            icon: GithubIcon,
            label: 'GitHub',
          },
        ]}
        aside={
          <AgentSkillCard
            agent={{
              code: `Read ${SITE_URL}/skills.md, then set up LobeHub lint in this project with npx create-lobe-lint --preset -y and fix the reported problems.`,
              description: 'Send this prompt to your coding agent',
            }}
            footer={
              <>
                <a href="/skills.md" rel="noreferrer" target="_blank">
                  skills.md
                </a>
                <a href="/llms.txt" rel="noreferrer" target="_blank">
                  llms.txt
                </a>
              </>
            }
            human={{
              code: 'npx create-lobe-lint',
              description: 'Run the setup CLI in your project root',
            }}
          />
        }
        onNavigate={navigate}
      />
      <LandingSection
        eyebrow="Why"
        eyebrowColor="blue"
        id="home-features"
        title="LobeHub's code style, in a minute"
      >
        <FeatureGrid items={FEATURES} renderLink={renderLink} />
      </LandingSection>
      <InstallBanner
        command="npx create-lobe-lint"
        footnote="Open source · MIT license"
        title="Set up your project"
      />
    </>
  );
}
