// const TerserPlugin = require('terser-webpack-plugin')

/**
 * @type {import('next').NextConfig}
 **/

const { default: classnamesMinifier } = require('@nimpl/classnames-minifier')

const withBundleAnalyzer = require('@next/bundle-analyzer')
// const withMDX = require('@next/mdx')({
//   extension: /\.(md|mdx)$/,
// })

const productionBranchNames = ['master', 'main']

const isProductionBuild = process.env.NODE_ENV === 'production'

const isCloudBuild =
  // Cloudflare
  process.env.CF_PAGES ||
  // Vercel
  process.env.VERCEL

const isProductionDeployment =
  // Cloudflare
  productionBranchNames.includes(process.env.CF_PAGES_BRANCH) ||
  // Vercel
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === 'dev'

const nextConfig = {
  // reactStrictMode: false,
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
    ],
  },
  // experimental: {
  // typedRoutes: true,
  // optimizePackageImports: ['react-bootstrap'], // Optimized by default https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports
  // serverComponentsExternalPackages: ['react-bootstrap'],
  // },
  // Silence bootstrap deprecation warnings
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: [
      'legacy-js-api',
      'mixed-decls',
      'color-functions',
      'global-builtin',
      'import',
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '#',
  //       destination: '#',
  //       permanent: true,
  //     },
  //   ]
  // },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/whitepaper',
  //       destination: '/Whitepaper.pdf',
  //     },
  //   ]
  // },

  webpack(config /* , { isServer } */) {
    // config.externals.push('pino-pretty', 'lokijs', 'encoding')

    // if (!isServer) {
    //   config.resolve.fallback = {
    //     // crypto: require.resolve('crypto-browserify'),
    //     stream: false,
    //     buffer: false,
    //   }
    // }

    // config.optimization.minimizer = [
    //   new TerserPlugin({
    //     terserOptions: {
    //       // mangle: false, // Disable function renaming
    //       keep_fnames: true, // Preserve function names (prevents SHA256 loss)
    //       // keep_classnames: true, // Preserve class names (for internal PDFKit use)
    //     },
    //   }),
    // ]

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              // replaceAttrValues: {
              //   '#000': 'currentColor',
              //   '#FFF': 'currentColor',
              // },
              svgProps: {
                fill: 'currentColor',
              },
              // expandProps: false
            },
          },
        ],
      }
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

module.exports = () => {
  const plugins = [
    // withMDX,
    classnamesMinifier({
      prefix: 'll_',
      disabled:
        (isCloudBuild && !isProductionDeployment) ||
        (!isCloudBuild && !isProductionBuild),
      // disableDistDeletion: true,
    }),
  ]

  plugins.push(
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === 'true',
    })
  )

  return plugins.reduce((acc, next) => next(acc), nextConfig)
}
