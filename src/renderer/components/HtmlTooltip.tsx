import React from 'react';
import { withStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      fontSize: theme.typography.pxToRem(12)
    },
  }))(Tooltip);

  export default HtmlTooltip;