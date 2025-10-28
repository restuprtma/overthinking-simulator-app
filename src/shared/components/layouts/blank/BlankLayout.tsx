import { Outlet } from "react-router";
import ScrollToTop from "src/shared/components/theme-ui/ScrollToTop";

const BlankLayout = () => (
  <>
    <ScrollToTop>
      <Outlet />
    </ScrollToTop>
  </>
);

export default BlankLayout;
