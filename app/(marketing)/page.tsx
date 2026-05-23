import { Hero } from '@/components/marketing/hero'
import { Features } from '@/components/marketing/features'
import { PipelinePreview } from '@/components/marketing/pipeline-preview'
import { Pricing } from '@/components/marketing/pricing'
import { Cta } from '@/components/marketing/cta'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <PipelinePreview />
      <Pricing />
      <Cta />
    </>
  )
}
