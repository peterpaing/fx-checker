import { JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import Header from '@/app/component/Header'
import { ExchangeProvider } from "@/app/component/ExchangeContext"
import ExchangeInput from '@/app/component/ExchangInput'
import Navbar from '@/app/component/Navbar'
import NavSelect from '@/app/component/NavSelect'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className={`${jetbrainsMono.className} min-h-full flex flex-col bg-black text-white`}>
        <Header/>
        <ExchangeProvider>
        <ExchangeInput/>
        <Navbar/>
        <NavSelect/>
        {children}
      </ExchangeProvider>
      </body>
    </html>
  );
}
