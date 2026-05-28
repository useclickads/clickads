export interface JsonLdProps {
  data: Record<string, any>
}

/**
 * Renders JSON-LD structured data as a <script> tag
 * Usage: <JsonLd data={organizationSchema} />
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      suppressHydrationWarning
    />
  )
}
