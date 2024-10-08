// icon:lightbulb-night-outline | Material Design Icons https://materialdesignicons.com/ | Austin Andrews
import * as React from 'react';

function OverNightIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1em"
            width="1em"
            {...props}
        >
            <path d="M6 20h6v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-1m5-5.11V16H7v-2.42C5.23 12.81 4 11.05 4 9c0-2.76 2.24-5 5-5 .9 0 1.73.26 2.46.67.54-.47 1.2-.86 1.89-1.17C12.16 2.57 10.65 2 9 2 5.13 2 2 5.13 2 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-.68c-.75-.36-1.43-.82-2-1.43m9.92-4.95l-.5-1.64 1.3-1.08-1.68-.04-.63-1.58-.56 1.61-1.68.11 1.33 1.03-.4 1.65 1.4-.97 1.42.91m-1.8 2.31a4.622 4.622 0 01-3.27-2.28c-.73-1.26-.8-2.72-.35-4 .14-.34-.16-.68-.5-.63-3.44.66-5 4.79-2.78 7.61 1.81 2.24 5.28 2.32 7.17.05.23-.26.08-.7-.27-.75z" />
        </svg>
    );
}

export default OverNightIcon;
