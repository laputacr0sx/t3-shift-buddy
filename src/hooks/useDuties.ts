import { useState } from 'react';
import { type SafeParseReturnType } from 'zod';
import { api } from '~/utils/api';

interface UseDuty {
    rotaParser: SafeParseReturnType<string[], string[]>;
}

export default function useDuties({ rotaParser }: UseDuty) {
    const [validSequence, setValidSequence] = useState<null | string[]>(null);

    if (rotaParser.success) {
        setValidSequence(rotaParser.data);
    }
}
