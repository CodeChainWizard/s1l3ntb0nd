import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// import { useEffect } from "react";
// import type { AppProps } from "next/app";

// function MyApp({ Component, pageProps }: AppProps) {
//   useEffect(() => {
//     // Disable Right Click
//     document.addEventListener("contextmenu", (e) => e.preventDefault());

//     // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
//     document.addEventListener("keydown", (e) => {
//       if (
//         e.key === "F12" || // Windows DevTools
//         (e.ctrlKey && e.shiftKey && e.key === "I") || // Windows: Ctrl + Shift + I
//         (e.ctrlKey && e.shiftKey && e.key === "J") || // Windows: Ctrl + Shift + J
//         (e.ctrlKey && e.key === "U") || // Windows: Ctrl + U (View Source)
//         (e.metaKey && e.altKey && e.key === "I") || // Mac: ⌘ + ⌥ + I
//         (e.metaKey && e.altKey && e.key === "J") || // Mac: ⌘ + ⌥ + J
//         (e.metaKey && e.key === "U") || // Mac: ⌘ + U
//         (e.metaKey && e.shiftKey && e.key === "C") // Mac: ⌘ + Shift + C (Inspect)
//       ) {
//         e.preventDefault();
//       }
//     });

//     // Detect DevTools Opening
//     const detectDevTools = () => {
//       const element = new Image();
//       Object.defineProperty(element, "id", {
//         get: function () {
//           alert("Developer Tools are disabled on this site!");
//           window.location.reload();
//         },
//       });
//       console.log("%c", element);
//     };

//     setInterval(detectDevTools, 1000);
//   }, []);

//   return <Component {...pageProps} />;
// }

// export default MyApp;
