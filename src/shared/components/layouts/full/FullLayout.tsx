import { FC, useContext } from 'react';
import { Outlet } from 'react-router';
import { CustomizerContext } from '@/app/providers/CustomizerProvider';
import Sidebar from './vertical/sidebar/Sidebar';
import Header from './vertical/header/Header';
import ScrollToTop from 'src/shared/components/theme-ui/ScrollToTop';

const FullLayout: FC = () => {
  const { activeLayout, isLayout } = useContext(CustomizerContext);

  return (
    <>
      <div className="flex w-full h-screen overflow-hidden dark:bg-darkgray">
        <div className="page-wrapper flex w-full">
          {/* Header/sidebar */}

          {activeLayout == 'vertical' ? <Sidebar /> : null}
          <div className="page-wrapper-sub flex flex-col w-full dark:bg-darkgray overflow-hidden">
            {/* Top Header  */}
            {activeLayout == 'horizontal' ? (
              <Header layoutType="horizontal" />
            ) : (
              <Header layoutType="vertical" />
            )}

            <div
              className={`bg-lightgray dark:bg-dark flex-1 overflow-auto ${
                activeLayout != 'horizontal' ? 'rounded-bb' : 'rounded-none'
              }`}
            >
              {/* Body Content  */}
              <div
                // className={`h-full ${isLayout == 'full' ? '' : 'container mx-auto py-30'} ${
                //   activeLayout == 'horizontal' ? 'xl:mt-3' : ''
                // }`}
                className={`h-full ${isLayout == 'full' ? '' : 'container mx-auto py-30'}`}
              >
                <ScrollToTop>
                  <Outlet />
                </ScrollToTop>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FullLayout;
