import { Button } from '@/shared/components/theme-ui';
import { Link } from "react-router";
import { ROUTES } from '@/app/constants/router';

/**
 * 403 Forbidden Page
 * Shown when user doesn't have permission to access a resource
 */
const ForbiddenPage = () => (
  <div className="h-screen flex items-center justify-center bg-white dark:bg-darkgray">
    <div className="text-center max-w-lg mx-auto px-4">
      <div className="mb-8">
        <div className="text-9xl font-bold text-primary mb-4">403</div>
        <h1 className="text-dark dark:text-white text-4xl font-semibold mb-4">
          Access Denied
        </h1>
        <p className="text-xl text-dark dark:text-white opacity-70 mb-2">
          You don't have permission to access this page.
        </p>
        <p className="text-base text-bodytext dark:text-bodytextdark">
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
      <Button
        color="primary"
        as={Link}
        to={ROUTES.ROOT}
        className="w-fit mx-auto"
      >
        Go Back to Home
      </Button>
    </div>
  </div>
);

export default ForbiddenPage;
