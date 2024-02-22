import { api } from '~/utils/api';

export default function useDuty(dutyNumber: string) {
    return api.dutyController.getDutyByDutyNumber.useQuery(dutyNumber);
}
