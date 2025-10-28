import CardBox from 'src/shared/components/theme-ui/CardBox'
import { Link } from "react-router"
import BoxedAuthLogin from '../components/forms/BoxedAuthForms'
import BoxedAuthSlider from '../components/forms/BoxedAuthSlider'
import BoxedSocialButtons from '../components/forms/BoxedSocialButtons'
import FullLogo from '@/shared/components/layouts/full/shared/logo/FullLogo'
import { ROUTES } from '@/app/constants/router'

const LoginPage = () => {
  return (
    <>
      <div className="relative min-h-screen flex flex-col justify-center bg-cover bg-center bg-[url('/src/assets/images/backgrounds/login-bg.jpg')]">
        <div className="flex h-full justify-center items-center px-4">
          <CardBox className="xl:max-w-6xl lg:max-w-3xl md:max-w-xl w-full border-none p-0">
            <div className="grid grid-cols-12">
              <div className="xl:col-span-6 col-span-12 px-8 xl:border-e border-ld">
                <div className="md:py-14 py-8 lg:px-6">
                  <FullLogo />
                  <h3 className="md:text-34 text-2xl md:my-8 my-5">Let's get you signed in</h3>
                  <BoxedSocialButtons title="Or sign in with email" />
                  <BoxedAuthLogin />
                  <div className="flex gap-2 text-base dark:text-white font-medium mt-6 items-center justify-center">
                    <p>New to MatDash?</p>
                    <Link
                      to={ROUTES.AUTH.REGISTER}
                      className="text-primary text-sm font-medium"
                    >
                      Create an account
                    </Link>
                  </div>
                </div>
              </div>
              <div className="xl:col-span-6 col-span-12 xl:block hidden">
                <BoxedAuthSlider />
              </div>
            </div>
          </CardBox>
        </div>
      </div>
    </>
  )
}

export default LoginPage
