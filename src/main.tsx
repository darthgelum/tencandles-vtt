import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ToastBar, Toaster } from "react-hot-toast"
import { keyframes } from "goober"
import "globals.css"
import Lobby from "components/Lobby"
import ErrorPage from "components/ErrorPage"
import Room from "components/Room"
import { UserProvider } from "context/UserContext"
import Test from "components/Test"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Lobby />,
    errorElement: <ErrorPage />,
  },
  {
    path: "room/:room",
    element: <Room />,
  },
  {
    path: "test",
    element: <Test />,
  },
])

const slideInAnimation = `0% {transform: translate3d(0,200%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}`
// const fadeInAnimation = `0%{opacity:0;} 100%{opacity:1;}`
const fadeOutAnimation = `0%{opacity:1;} 100%{opacity:0;}`

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <RouterProvider router={router} />
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: "!bg-[rgba(60,60,60)] !text-white !p-4 !max-w-full leading-relaxed",
        duration: 2000,
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            ...t.style,
            animation: t.visible
              ? `${keyframes(slideInAnimation)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`
              : `${keyframes(fadeOutAnimation)} 1.5s forwards`,
          }}
        />
      )}
    </Toaster>
  </UserProvider>
)
