import LogoLakukan from '/src/assets/images/logos/logo.png';
import { Link } from 'react-router';

const FullLogo = () => {
  return (
    <Link to={'/'}>
      <img src={LogoLakukan} alt="Lakukan Logo" className="block h-6" />
    </Link>
  );
};

export default FullLogo;
