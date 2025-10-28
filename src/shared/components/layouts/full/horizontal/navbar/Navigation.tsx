import { useState, useMemo, useRef } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import ChildComponent from './ChildComponent';
import { Icon } from "@iconify/react";
import Menuitems from '../../../../../../app/router/TopbarItems';
import { Link, useLocation } from "react-router";
import { usePermission } from '@/shared/hooks';

const Navigation = () => {
  const { hasPermission } = usePermission();
  const location = useLocation();
  const pathname = location.pathname;

  // Filter menu items by permissions
  const filteredMenuitems = useMemo(() => {
    return Menuitems.map(item => {
      // Filter children based on permissions
      const filteredChildren = item.children?.filter(child => {
        // If no permission required, show the item
        if (!child.permission) return true;
        // Check if user has permission
        return hasPermission(child.permission);
      }) || [];

      return {
        ...item,
        children: filteredChildren
      };
    });
  }, [hasPermission]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownEnter = (itemId: any) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(itemId);
  };

  const handleDropdownLeave = () => {
    // Delay closing to allow mouse to move to dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleChildClick = () => {
    // Close dropdown when child is clicked
    setActiveDropdown(null);
  };
  return (
    <nav className="horizontal-nav-inline">
      <ul className="flex items-center space-x-2">
          {filteredMenuitems.map((item) => {
            let isActive = false;
            // Check if current item or any of its children is active
            if (item.children && item.children.length > 0) {
              item.children.find((child:any) => {
                if(child?.children){
                  let nestedvalue = child.children.find((value:any) => value.href === pathname);
                  if(nestedvalue){isActive = true}
                }else{
                  let value = child.href === pathname;
                  if(value){isActive = true}
                }
              })
            } else {
              // For items without children, check if the item itself is active
              isActive = item.href === pathname;
            }
            return (
              <li key={item.id} className="relative group">
              {item.children && item.children.length > 0 ? (
                <div
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter(item.id)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="relative inline-flex flex-col items-center px-3 py-2">
                    {item.href ? (
                      <Link
                        to={item.href}
                        className={`flex gap-2 items-center text-sm cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'text-primary font-semibold'
                            : 'text-darklink dark:text-white hover:text-primary font-normal'
                        }`}
                      >
                        <Icon icon={`${item.icon}`} height={18} />
                        <span>{item.title}</span>
                        {item.children && <IconChevronDown size={16} />}
                      </Link>
                    ) : (
                      <div
                        className={`flex gap-2 items-center text-sm cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'text-primary font-semibold'
                            : 'text-darklink dark:text-white hover:text-primary font-normal'
                        }`}
                      >
                        <Icon icon={`${item.icon}`} height={18} />
                        <span>{item.title}</span>
                        {item.children && <IconChevronDown size={16} />}
                      </div>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>
                    )}
                  </div>
                  {activeDropdown === item.id && (
                    <div
                      className={`absolute left-0 rtl:right-0 mt-2  bg-white dark:bg-dark rounded-md shadow-lg z-50 ${item.column == 4 ? 'w-screen max-w-[800px]' : 'w-52'}`}
                      onMouseEnter={() => handleDropdownEnter(item.id)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <ul className={`p-3 text-sm  gap-2  ${item.column == 4 ? 'two-cols' : 'flex flex-col'} `}>
                        {item.children.map((child) => (
                          <li key={child.id} className={` ${item.column == 4 ? 'mb-2' : ''} `}>
                            <ChildComponent
                              item={child}
                              title={item.title}
                              isActive={activeDropdown === item.id}
                              handleMouseEnter={() => handleDropdownEnter(item.id)}
                              handleMouseLeave={handleDropdownLeave}
                              onClick={handleChildClick}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative inline-flex flex-col items-center px-3 py-2">
                  <Link
                    to={item.href}
                    className={`flex gap-2 items-center text-sm whitespace-nowrap ${
                      item.href === pathname
                        ? 'text-primary font-semibold'
                        : 'text-darklink dark:text-white hover:text-primary font-normal'
                    }`}
                  >
                    <Icon icon={`${item.icon}`} height={18} />
                    <span>{item.title}</span>
                  </Link>
                  {item.href === pathname && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></span>
                  )}
                </div>
              )}
            </li>
            )
          })}
        </ul>
    </nav>
  );
};

export default Navigation;
