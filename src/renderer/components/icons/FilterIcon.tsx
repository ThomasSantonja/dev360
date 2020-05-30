import React from "react";
import { SvgIcon } from "@material-ui/core";

export default function FilterIcon(props: any) {
    const { ...rest } = props;
    return (
        <SvgIcon viewBox="0 0 321.9 321.9" {...rest}>
            <path d="M128.25,175.6c1.7,1.8,2.7,4.1,2.7,6.6v139.7l60-51.3v-88.4c0-2.5,1-4.8,2.7-6.6L295.15,65H26.75L128.25,175.6z"/>
			<rect x="13.95" y="0" width="294" height="45"/>
        </SvgIcon>
    );
}