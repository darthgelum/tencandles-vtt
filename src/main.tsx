import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import "globals.css"
import Lobby from "components/Lobby"
import ErrorPage from "components/ErrorPage"
import Room from "components/Room"
import { UserProvider } from "context/UserContext"

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
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <RouterProvider router={router} />
    <Toaster
      toastOptions={{
        className: "bg-grey text-white",
        duration: 2000,
      }}
    />
  </UserProvider>
)
