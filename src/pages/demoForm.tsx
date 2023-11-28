import { Fragment, useMemo } from "react";
import { ExchangeColumn } from "~/components/Exchange/ExchangeColumn";
import { ExchangeTable } from "~/components/Exchange/ExchangeTable";
import { VerticalExchangeTable } from "~/components/Exchange/VerticalExchangeTable";
import { Separator } from "~/components/ui/separator";
import { autoPrefix } from "~/utils/helper";

export default function DemoExchangeForm() {
  const days = useMemo(() => {
    return autoPrefix(true);
  }, []);

  return (
    <>
      <ExchangeTable
        daysDetails={days}
        columns={ExchangeColumn}
        data={[
          {
            name: "NGSH",
            grade: "G50",
            staffId: "6029XX",
            rowSequence: "A80",
            exchangeDetails: {
              "20231129": "134",
              "20231130": "135",
              "20231201": "136",
              "20231202": "137",
              "20231203": "138",
            },
            weekNumber: "49",
          },
          {
            name: "WKSO",
            grade: "G50",
            staffId: "6093XX",
            rowSequence: "B80",
            exchangeDetails: {
              "20231129": "502",
              "20231130": "881113",
              "20231201": "881113",
              "20231202": "RD",
              // "20231203": "551",
            },
            weekNumber: "49",
          },
        ]}
      />
      {/* <Separator className="w-auto py-2" />
      <VerticalExchangeTable
        daysDetails={days}
        columns={ExchangeColumn}
        data={[
          {
            name: "NGSH",
            grade: "G50",
            staffId: "6029XX",
            rowSequence: "A80",
            exchangeDetails: {
              "20231129": "134",
              "20231130": "135",
              "20231201": "136",
              "20231202": "137",
              "20231203": "138",
            },
            weekNumber: "49",
          },
          {
            name: "WKSO",
            grade: "G50",
            staffId: "6093XX",
            rowSequence: "B80",
            exchangeDetails: {
              "20231129": "502",
              "20231130": "881113",
              "20231201": "881113",
              "20231202": "RD",
              // "20231203": "551",
            },
            weekNumber: "49",
          },
        ]}
      /> */}
    </>
  );
}

{
  happy: "123";
}
