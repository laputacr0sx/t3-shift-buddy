import { api } from '~/utils/api';

interface UseDuty {
    sequence: string[];
}

export default function useDuties({ sequence }: UseDuty) {
    return api.dutyController.getDutiesBySequence.useQuery(sequence);
}
