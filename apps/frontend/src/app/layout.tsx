import './global.css';
import { AlertProvider } from '../components/AlertProvider';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>App Passeios Turísticos</title>
        <meta name="description" content="Sistema de gerenciamento de passeios turísticos" />
      </head>
      <body>
        <AlertProvider>
          {children}
        </AlertProvider>
      </body>
    </html>
  );
}
