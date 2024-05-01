import type { DetailedHTMLProps, ReactNode } from 'react';

import { cn } from '~/lib/utils';
import { getRacingStyle } from '~/utils/helper';
import { type Fixture } from '~/utils/hkjcFixture';

type BaseButtonAttributes = DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
>;

type CardDateParagraphProps = {
    readonly children: ReactNode;
    isRedDay: boolean;
    racingDetail: Fixture | null;
} & BaseButtonAttributes;

function CardDateParagraph({
    isRedDay,
    racingDetail,
    children,
    ...rest
}: CardDateParagraphProps) {
    return (
        <p
            {...rest}
            className={cn(
                'flex items-center rounded px-1 font-mono text-sm xs:text-base',
                isRedDay && 'bg-rose-500/40 dark:bg-rose-300/40',
                getRacingStyle(racingDetail)
            )}
        >
            {children}
        </p>
    );
}

export default CardDateParagraph;
