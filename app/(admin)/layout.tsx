export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body style={{ margin: 0, backgroundColor: '#050810' }} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
