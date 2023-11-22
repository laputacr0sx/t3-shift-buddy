import moment from "moment";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import {
  type SevenSlotsSearchForm,
  dayDetailName,
} from "~/components/SevenSlotsSearch";
import { type autoPrefix } from "~/utils/helper";
import { abbreviatedDutyNumber } from "~/utils/regex";

function useShiftQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleQuery = async (
    autoDayDetail: ReturnType<typeof autoPrefix>,
    data: SevenSlotsSearchForm
  ) => {
    console.log("handleQuery func called");

    const newParams = new URLSearchParams(searchParams.toString());

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
  };

  return { router, handleQuery };
}

export default useShiftQuery;
