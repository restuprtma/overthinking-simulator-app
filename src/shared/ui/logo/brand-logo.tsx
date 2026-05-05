import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type BrandLogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function BrandLogo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = false,
  ...other
}: BrandLogoProps) {
  return (
    <BrandLogoRoot
      component={RouterLink}
      href={href}
      aria-label="Jesuit Finance logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 140,
          height: 48,
          ...(isSingle && { width: 40, height: 40 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <img
        alt="Jesuit Finance logo"
        src="/logo/logo-jesuit.png"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </BrandLogoRoot>
  );
}

// ----------------------------------------------------------------------

const BrandLogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
