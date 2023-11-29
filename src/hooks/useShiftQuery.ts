import moment from "moment";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

import { useCallback } from "react";
import {
  type SevenSlotsSearchForm,
  dayDetailName,
} from "~/components/SevenSlotsSearchForm";
import { type autoPrefix } from "~/utils/helper";
import { abbreviatedDutyNumber } from "~/utils/regex";

function useShiftQuery() {
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();

  const handleQuery = useCallback(
    async (
      autoDayDetail: ReturnType<typeof autoPrefix>,
      data: SevenSlotsSearchForm
    ) => {
      const newParams = new URLSearchParams();

      data[dayDetailName]?.forEach(({ shiftCode }, i) => {
        const date = moment(autoDayDetail[i]?.date, "YYYYMMDD ddd").format(
          "YYYYMMDD"
        );
        const prefix = autoDayDetail[i]?.prefix as string;
        const shiftCodeWithPrefix = shiftCode.match(abbreviatedDutyNumber)
          ? `${prefix}${shiftCode}`
          : `${shiftCode}`;
        if (shiftCode) {
          newParams.set(date, shiftCodeWithPrefix);
        }
      });
      await router.push(`${pathname}?${newParams.toString()}`);

      return newParams;
    },
    [pathname, router]
  );

  return { router, handleQuery };
}

export default useShiftQuery;
