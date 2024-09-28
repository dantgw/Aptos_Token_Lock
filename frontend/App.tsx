import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
// Internal pages
import { Mint } from "@/pages/Mint";
import { CreateFungibleAsset } from "@/pages/CreateFungibleAsset";
import { MyFungibleAssets } from "@/pages/MyFungibleAssets";
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
        element: <Home />,
      },
      // {
      //   path: "create-asset",
      //   element: <CreateFungibleAsset />,
      // },
      // {
      //   path: "my-assets",
      //   element: <MyFungibleAssets />,
      // },
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
