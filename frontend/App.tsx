import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

import { MyTokenLocks } from "./pages/MyTokenLocks";
import { CreateTokenLock } from "./pages/CreateTokenLock";
import { Home } from "./pages/Home";
import { TokenLocks } from "./pages/TokenLocks";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <TokenLocks />,
      },
      {
        path: "token-locks",
        element: <TokenLocks />,
      },
      {
        path: "my-token-locks",
        element: <MyTokenLocks />,
      },
      {
        path: "create-token-lock",
        element: <CreateTokenLock />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
