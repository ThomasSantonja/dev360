import { Theme, createMuiTheme, makeStyles, createStyles } from "@material-ui/core";

export class CustomTheme {
    static Dark: Theme;
    static DARK_LIGHT = '#797979';
    static DARK_MAIN = '#3f3f3f';
    static DARK_DARK = '#303030';
    static DARK_DARKER = '#202020';

    constructor() {
        CustomTheme.Dark = createMuiTheme({
            palette: {
                type: 'dark',
                primary: {
                    light: CustomTheme.DARK_LIGHT,
                    main: CustomTheme.DARK_DARK,
                    dark: CustomTheme.DARK_MAIN
                }
            },
            overrides: {
                MuiCssBaseline: {
                    '@global': {
                        '*': {
                            'scrollbar-width': 0,
                        },
                        '*::-webkit-scrollbar': {
                            width: 0,
                            height: 0,
                        }
                    }
                },
                MuiSvgIcon: {
                    root: { width: 32, height: 32 }
                }
            }
        });
    }
}
new CustomTheme();