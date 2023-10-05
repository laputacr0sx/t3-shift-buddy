import React from "react";
import {
  type ShiftTable,
  columns,
} from "~/components/ShiftTable/Shifts-column";
import { DataTable } from "~/components/ShiftTable/Shifts-data-table";
import { api } from "~/utils/api";
import { convertDuration, getNextWeekDates } from "~/utils/helper";
import { dutyInputRegExValidator, sevenShiftRegex } from "~/utils/regex";
import { type ParsedUrlQuery, encode } from "querystring";
import useShiftsArray from "~/hooks/useShiftsArray";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import moment from "moment";
import { toast } from "~/components/ui/useToast";

export const dutyLocation = ["HUH", "SHT", "SHS", "HTD", "LOW", "TAW"];

export const dayDetailSchema = z.object({
  date: z.string(),
  title: z.string(),
  id: z.string(),
  dutyNumber: z.string().regex(dutyInputRegExValidator),
  bNL: z.enum(["HUH", "SHT", "SHS", "HTD", "LOW", "TAW"]),
  bNT: z.string(),
  bFT: z.string(),
  bFL: z.enum(["HUH", "SHT", "SHS", "HTD", "LOW", "TAW"]),
  duration: z.string(),
  remarks: z.string(),
});

export type DayDetail = z.infer<typeof dayDetailSchema>;

function WholeWeek({ legitRawShiftArray }: RawShiftArray) {
  const compleShiftNameArray = useShiftsArray(legitRawShiftArray);

  const compleShiftNameArraySchema = z.array(z.string());

  const validatedCompleShiftNameArray =
    compleShiftNameArraySchema.safeParse(compleShiftNameArray);

  if (!validatedCompleShiftNameArray.success) {
    console.error(validatedCompleShiftNameArray.error);
    return;
  }

  const {
    data: shiftsArray,
    isLoading: shiftsArrayLoading,
    error: shiftsArrayError,
    refetch: shiftArrayRefetch,
  } = api.shiftController.getWeekShift.useQuery(
    {
      shiftArray: validatedCompleShiftNameArray.data,
    },
    {
      // enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  if (shiftsArrayLoading) return <>Loading Shifts...</>;

  if (shiftsArrayError) return <>Shifts Error </>;

  const nextWeekDates = getNextWeekDates();

  const combinedDetail = new Array<ShiftTable>(7);

  for (let i = 0; i < validatedCompleShiftNameArray.data.length; i++) {
    const exactShift = shiftsArray.filter(
      (shift) => shift.dutyNumber === validatedCompleShiftNameArray.data[i]
    );
    const [shift] = exactShift;

    combinedDetail[i] = {
      date: nextWeekDates[i]?.toISOString(),
      title: validatedCompleShiftNameArray.data[i],
      dutyNumber: shift?.dutyNumber || validatedCompleShiftNameArray.data[i],
      ...shift,
    } as ShiftTable;
  }

  async function handleCopyAll() {
    if (!navigator || !navigator.clipboard)
      throw Error("No navigator object nor clipboard found");

    let completeString = "```\n";

    for (const dayDetail of combinedDetail) {
      const validatedDayDetail = dayDetailSchema.safeParse(dayDetail);

      if (!validatedDayDetail.success) {
        break;
      }

      const date = moment(dayDetail.date).locale("zh-hk").format("DD/MM ddd");
      const durationDecimal = convertDuration(validatedDayDetail.data.duration);
      const dayString = `${date} ${validatedDayDetail.data.dutyNumber} ${durationDecimal}\n[${validatedDayDetail.data.bNL}]${validatedDayDetail.data.bNT}-${validatedDayDetail.data.bFT}[${validatedDayDetail.data.bFL}]<${validatedDayDetail.data.remarks}>\n`;

      completeString = completeString + dayString;
    }
    completeString = completeString + "```";
    await navigator.clipboard.writeText(completeString);
    toast({
      title: `已複製整週資料`,
      description: completeString,
    });
  }

  return (
    <div className="flex h-full w-screen flex-col gap-2 py-2">
      {validatedCompleShiftNameArray.success ? (
        <>
          <Button
            variant={"secondary"}
            className="items-center self-center"
            onClick={() => {
              void handleCopyAll();
            }}
          >
            複製整週資料
          </Button>
          <DataTable columns={columns} data={combinedDetail} />
        </>
      ) : (
        <Button variant={"secondary"} onClick={() => shiftArrayRefetch()}>
          Refect
        </Button>
      )}
    </div>
  );
}

export const shiftSequenceSchema = z.string();

export const rawShiftArraySchema = z.array(z.string().regex(sevenShiftRegex));

export type RawShiftArray = {
  legitRawShiftArray: z.infer<typeof rawShiftArraySchema>;
};

export const getServerSideProps = ({
  params,
}: {
  params: ParsedUrlQuery | undefined;
}) => {
  const parsedURLQueryParams = new URLSearchParams(encode(params));
  const shiftSequence: unknown = parsedURLQueryParams.get("shiftsequence");
  const validatedShiftSequence = shiftSequenceSchema.safeParse(shiftSequence);

  if (!validatedShiftSequence.success) {
    console.error(validatedShiftSequence.error);
    return { props: { legitRawShiftArray: [""] } };
  }

  const rawShiftArray: unknown =
    validatedShiftSequence.data.match(sevenShiftRegex);
  const validatedRawShiftArray = rawShiftArraySchema.safeParse(rawShiftArray);

  if (!validatedRawShiftArray.success) {
    console.error(validatedRawShiftArray.error);
    return { props: { legitRawShiftArray: [""] } };
  }

  const legitRawShiftArray = validatedRawShiftArray.data;

  return { props: { legitRawShiftArray } };
};

export default WholeWeek;
