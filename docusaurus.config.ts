import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Rust Up Knowledge',
  tagline: 'Keep your Rust sharp. Not rusty.',
  favicon: 'img/rust-up-knowledge.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://jwjang.net',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/rust-up-knowledge/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'boba-jjang', // Usually your GitHub org/user name.
  projectName: 'rust-up-knowledge', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // ✅ Add fonts here (inside config)
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600;700&display=swap',
      type: 'text/css',
    },
  ],

  presets: [
    [
      'classic',
      {
        // docs: {
        //   sidebarPath: './sidebars.ts',
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  


themeConfig: {
    announcementBar: {
      id: 'rust-up-knowledge-announce-1',
      backgroundColor: '#7063f3',
      isCloseable: false,
      content:
      `My personal Rust knowledge base, built while working through the Rust Book (2021). ` +
      `<a href="/rust-up-knowledge/docs/intro">Start here</a>`,
    }, // make this font bolder
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: { // right underneath the announcement bar
      title: 'Rust Up Knowledge',
      logo: {
        alt: 'Rust Up Knowledge',
        src: 'img/rust.png',
      },
      hideOnScroll: true,
      items: [
        {to: '/docs/intro', label: 'Start reading', position: 'left'},
        {to: '/docs/cheatsheet', label: 'Cheatsheet', position: 'left'},
        {to: 'https://doc.rust-lang.org/book/appendix-01-keywords.html', label: 'Keywords', position: 'left'},
        {to: 'https://doc.rust-lang.org/book/appendix-02-operators.html', label: 'Operators/Symbols', position: 'left'},
        {
          href: 'https://github.com/boba-jjang/rust-up-knowledge',
          label: 'Github',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Rust',
          items: [
            {
              label: 'The Rust Book',
              href: 'https://doc.rust-lang.org/book/',
            },
            {
              label: 'Rust Std Library',
              href: 'https://doc.rust-lang.org/std/',
            },
            {
              label: 'Rust by Example',
              href: 'https://doc.rust-lang.org/rust-by-example/',
            },
          ],
        },
        {
          title: 'Playground',
          items: [
            {
              label: 'Rust Playground',
              href: 'https://play.rust-lang.org/',
            },
            {
              label: 'Compiler Explorer (Godbolt)',
              href: 'https://godbolt.org/',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'Rust Up Knowledge (GitHub)',
              href: 'https://github.com/boba-jjang/rust-up-knowledge',
            },
          ],
        },
      ],
      copyright: `
        © ${new Date().getFullYear()} boba-jjang · Rust Up Knowledge  
        <br />
      `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
