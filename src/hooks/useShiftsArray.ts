import { type WeekPrefix } from "@prisma/client";
import { z } from "zod";
import { type RawShiftArray } from "~/pages/wholeweek/[shiftsequence]";
import { api } from "~/utils/api";
import { threeDigitShiftRegex } from "~/utils/regex";

const prefixArraySchema = z.array(z.string()).length(7);

function useShiftsArray(rawShiftsArray: string[]): string[] {
  const {
    data: currentPrefixData,
    isLoading: currentPrefixDataLoading,
    error: currentPrefixDataError,
    isSuccess: currentPrefixDataSuccess,
  } = api.prefixController.getCurrentPrefix.useQuery<WeekPrefix[]>(undefined, {
    refetchOnWindowFocus: false,
  });

  if (currentPrefixDataError) throw currentPrefixDataError;

  if (currentPrefixDataLoading) return [""];

  const validatedCurrentPrefixData = prefixArraySchema.safeParse(
    currentPrefixData[0]?.prefixes
  );

  if (!validatedCurrentPrefixData.success) {
    throw validatedCurrentPrefixData.error;
  }

  const compleShiftNameArray = validatedCurrentPrefixData.data.map(
    (prefix, i) => {
      return !threeDigitShiftRegex.test(rawShiftsArray[i] as string)
        ? (rawShiftsArray[i] as string)
        : prefix.concat(rawShiftsArray[i] as string);
    }
  );

  return compleShiftNameArray;
}

export default useShiftsArray;
