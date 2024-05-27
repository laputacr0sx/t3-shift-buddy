import GSTC, {
    type GSTCResult,
    type Config
} from 'gantt-schedule-timeline-calendar';
import { useEffect, useState } from 'react';
import type DeepState from 'deep-state-observer';
import dynamic from 'next/dynamic';

const DelayedGanntTimeline = dynamic(
    () => import('~/components/CalendarTest'),
    { ssr: false }
);

function NewFeature() {
    return <DelayedGanntTimeline />;
}

export default NewFeature;
