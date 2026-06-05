import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
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
      aria-label="Tuai logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          ...(isSingle && { width: 32, height: 32 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? (
        <Box
          component="img"
          alt="Tuai logo"
          src="/logo/tuai-logo-mark.png"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
      ) : (
        <Box
          component="img"
          alt="Tuai - Smart Stock Trading Utility"
          src="/logo/tuai-logo-linear-light.png"
          sx={(theme) => ({
            height: 36,
            width: 'auto',
            objectFit: 'contain',
            flexShrink: 0,
            ...theme.applyStyles('dark', {
              content: `url(/logo/tuai-logo-linear-dark.png)`,
            }),
          })}
        />
      )}
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
