import ErrorImg from "/src/assets/images/backgrounds/errorimg.svg";
import { Button } from '@/shared/components/theme-ui';
import { Link } from "react-router";
import { ROUTES } from '@/app/constants/router';

/**
 * 404 Not Found Page
 * Shown when the requested page doesn't exist
 */
const NotFoundPage = () => (
  <div className="h-screen flex items-center justify-center bg-white dark:bg-darkgray">
    <div className="text-center max-w-lg mx-auto">
      <img src={ErrorImg} alt="error" className="mb-4" />
      <h1 className="text-dark dark:text-white text-4xl mb-6">Opps!!!</h1>
      <h6 className="text-xl text-dark dark:text-white">
        This page you are looking for could not be found.
      </h6>
      <Button
        color="primary"
        as={Link}
        to={ROUTES.ROOT}
        className="w-fit mt-6 mx-auto"
      >
        Go Back to Home
      </Button>
    </div>
  </div>
);

export default NotFoundPage;
