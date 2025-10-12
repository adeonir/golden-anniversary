'use client'

import type { ComponentProps } from 'react'
import { PulseHeart } from '~/components/ui/pulse-heart'
import { usePostHog } from '~/hooks/use-posthog'
import { analyticsEvents } from '~/lib/analytics/events'

export function Footer() {
  const posthog = usePostHog()

  const handleFooterLinkClick = () => {
    posthog?.capture(analyticsEvents.footerLinkClick, {
      destination: 'adeonir.dev',
      link_type: 'external',
      link_text: 'Adeonir Kohl',
    })
  }

  return (
    <footer>
      <section className="bg-gold-200 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-8 font-script text-5xl text-gold-700 md:text-7xl">Iria e Ari</h2>

          <div className="mb-12 flex items-center justify-center gap-4">
            <div aria-hidden="true" className="h-0.5 w-24 bg-gold-400" />
            <div aria-hidden="true" className="size-3 rounded-full bg-gold-400" />
            <div className="flex items-center justify-center">
              <PulseHeart size="md" />
            </div>
            <div aria-hidden="true" className="size-3 rounded-full bg-gold-400" />
            <div aria-hidden="true" className="h-0.5 w-24 bg-gold-400" />
          </div>

          <blockquote aria-describedby="quote-attribution" className="mx-auto max-w-lg space-y-4">
            <p className="text-lg text-zinc-600 leading-relaxed sm:text-xl">
              "O amor não consiste em olhar um para o outro, mas sim em olhar juntos na mesma direção."
            </p>
            <cite className="text-sm text-zinc-500 sm:text-base" id="quote-attribution">
              - Antoine de Saint-Exupéry
            </cite>
          </blockquote>
        </div>
      </section>

      <section className="bg-gold-300 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-2 flex items-center justify-center gap-2 text-zinc-700">
            Site feito com carinho por
            <a
              aria-label="Link externo: Site do desenvolvedor Adeonir Kohl"
              href="https://adeonir.dev?utm_source=golden-anniversary&utm_medium=referral"
              onClick={handleFooterLinkClick}
              rel="noopener"
              target="_blank"
            >
              <AdeonirLogo className="h-auto w-32" />
            </a>
          </p>
          <p className="text-sm text-zinc-600">Desenvolvido especialmente para celebrar este momento único!</p>
        </div>
      </section>
    </footer>
  )
}

function AdeonirLogo(props: ComponentProps<'svg'>) {
  return (
    <svg
      data-slot="adeonir-logo"
      fill="none"
      height="22"
      viewBox="0 0 95 22"
      width="95"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Adeonir Kohl Logo</title>
      <path
        clipRule="evenodd"
        d="M37.8041 15.0615H37.0005V13.7186H36.9603C36.5946 14.6586 35.4868 15.2871 34.4702 15.2871C32.3458 15.2871 31.3318 13.5951 31.3318 11.601C31.3318 9.60682 32.3458 7.89334 34.4702 7.89334C35.4751 7.89334 36.4928 8.32647 36.8665 9.34796V5.39294H37.8041V15.0615ZM34.4702 14.6036C36.2704 14.6036 36.9188 13.07 36.9188 11.6198C36.9188 10.1695 36.2704 8.6346 34.4702 8.6346C32.8467 8.6346 32.1837 10.1681 32.1837 11.6198C32.1837 13.0714 32.8467 14.6036 34.4702 14.6036Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M24.5259 10.2272C24.6196 8.48148 25.7314 7.89868 27.3388 7.89868C28.5711 7.89868 29.8985 8.28274 29.8985 10.1681V13.8838C29.8985 14.2235 30.078 14.3994 30.4155 14.3994C30.5134 14.3978 30.6103 14.3797 30.7022 14.3457V15.0642C30.5172 15.0946 30.3295 15.1054 30.1423 15.0964C29.277 15.0964 29.1363 14.5243 29.1363 13.8529H29.1096C28.5001 14.6586 27.9188 15.2992 26.5646 15.2992C25.2653 15.2992 24.2231 14.6734 24.2231 13.262C24.2231 11.4401 25.8852 11.2528 27.604 11.0591C27.7271 11.0452 27.8506 11.0313 27.9737 11.0168C28.6782 10.9483 29.0707 10.8301 29.0707 10.0701C29.0707 8.91657 28.259 8.61577 27.2437 8.61577C26.1721 8.61577 25.4166 9.01862 25.3764 10.2272H24.5259ZM29.0975 11.1672H29.0439C28.937 11.4352 28.5592 11.5013 28.3286 11.5416L28.3273 11.5418C28.1121 11.5802 27.8892 11.6135 27.6656 11.6469C26.3845 11.8385 25.0804 12.0335 25.0804 13.1882C25.0804 14.0422 25.8372 14.5874 26.6489 14.5874C27.9616 14.5874 29.0975 13.7817 29.0975 12.4053V11.1672Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M42.1963 14.5136C40.5662 14.5136 39.8965 13.0472 39.8965 11.7043H45.2745C45.3348 9.82434 44.4092 7.84229 42.1937 7.84229C39.9782 7.84229 39.0405 9.76928 39.0405 11.6144C39.0405 13.6085 39.9741 15.3086 42.1937 15.3086C43.9685 15.3086 44.8726 14.2558 45.241 12.7786H44.3877C44.1172 13.8529 43.4407 14.5136 42.1963 14.5136ZM42.1963 8.53654C43.5626 8.53654 44.3743 9.82434 44.4159 11.0329H39.8965C40.0451 9.82434 40.7899 8.53654 42.1963 8.53654Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M52.6684 11.6197C52.6684 13.634 51.4924 15.322 49.3679 15.322C47.2435 15.322 46.0661 13.6273 46.0661 11.6197C46.0661 9.61216 47.2435 7.92285 49.3679 7.92285C51.4924 7.92285 52.6684 9.61216 52.6684 11.6197ZM46.918 11.6197C46.918 13.0969 47.7445 14.6036 49.3679 14.6036C50.9914 14.6036 51.8165 13.0982 51.8165 11.6197C51.8165 10.1412 50.9914 8.63457 49.3679 8.63457C47.7445 8.63457 46.918 10.1412 46.918 11.6197Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        d="M54.8156 8.07862H53.8779V15.0642H54.8156V11.0356C54.8156 9.66856 55.5884 8.63457 56.9681 8.63457C58.3478 8.63457 58.7001 9.55711 58.7001 10.7509V15.0615H59.6377V10.6153C59.6377 8.94745 59.0215 7.896 57.0605 7.896C56.08 7.896 55.147 8.33988 54.8156 9.26434V8.07862Z"
        fill="currentColor"
      />
      <path d="M61.2451 5.39294H62.0488V6.7358H61.2451V5.39294Z" fill="currentColor" />
      <path d="M61.2451 8.07866H62.0488V15.0615H61.2451V8.07866Z" fill="currentColor" />
      <path
        d="M64.4598 8.07846H63.6561V15.0613H64.5938V11.3886C64.5938 9.92355 65.6654 8.81166 67.1388 8.87881V8.02475C65.9332 7.96969 64.9554 8.48132 64.5214 9.68989H64.4598V8.07846Z"
        fill="currentColor"
      />
      <path
        d="M71.0232 5.39294H69.1479L69.1493 15.0615H71.0246V12.7249L71.7961 11.9676L73.7424 15.0615H76.0717L73.1356 10.6408L75.7757 8.07866H73.4986L71.0232 10.6502V5.39294Z"
        fill="currentColor"
      />
      <path
        clipRule="evenodd"
        d="M83.7685 11.64C83.7685 9.4028 82.3473 7.93774 80.1425 7.93774C77.9578 7.93774 76.5259 9.41488 76.5259 11.64C76.5259 13.8651 77.9377 15.3302 80.1425 15.3302C82.3473 15.3302 83.7685 13.8772 83.7685 11.64ZM81.8476 11.64C81.8476 12.7667 81.4552 13.8785 80.1425 13.8785C78.8432 13.8785 78.4507 12.7653 78.4507 11.64C78.4507 10.5147 78.8298 9.38803 80.1425 9.38803C81.4552 9.38803 81.8476 10.5133 81.8476 11.64Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        d="M84.9538 5.39294H86.9631V9.01865H86.9751C87.1837 8.67241 87.4787 8.38665 87.831 8.18955C88.1834 7.99245 88.5809 7.89082 88.9843 7.89468C91.027 7.89468 91.5119 9.08983 91.5119 10.8261V15.0615H89.6367V11.1793C89.6367 10.0258 89.3326 9.45642 88.4311 9.45642C87.389 9.45642 86.9577 10.0392 86.9577 11.4707V15.0682H84.9485L84.9538 5.39294Z"
        fill="currentColor"
      />
      <path d="M95 5.39294H93.1248V15.0615H95V5.39294Z" fill="currentColor" />
      <path
        clipRule="evenodd"
        d="M3.69194 20.1332L16.5209 21.2582L21.5554 9.35224L11.8362 0.863245L0.795738 7.5244L3.69194 20.1332ZM0 7.18696L3.12367 20.7861L16.9672 22L22.3975 9.15827L11.912 0L0 7.18696Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        d="M17.9611 7.94434H15.0571L12.2201 11.57V7.94434H9.34821L3.63934 15.33H6.54468L9.94294 10.8986V15.3368H12.2535L13.6546 13.5064L15.0571 15.3368H17.9611L15.1066 11.6439L17.9611 7.94434Z"
        fill="currentColor"
      />
    </svg>
  )
}
