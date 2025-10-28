import { RouterProvider } from "react-router";

import { Flowbite, ThemeModeScript } from '@/shared/components/theme-ui';
import { AlertDialogProvider } from '@venturo/react-ui';
import customTheme from '@/shared/utils/theme/custom-theme';
import router from "@/app/router/Router";

function App() {

  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <AlertDialogProvider>
          <RouterProvider router={router} />
        </AlertDialogProvider>
      </Flowbite>
    </>
  );
}

export default App;
