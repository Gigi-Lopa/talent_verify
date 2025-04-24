import "./styles/main.css"

export const metadata = {
  title: "Talent Verify",
  description: "Talent Verify Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
