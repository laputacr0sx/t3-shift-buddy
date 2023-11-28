import { useMemo } from "react";
import { ExchangeColumn } from "~/components/Exchange/ExchangeColumn";
import { ExchangeTable } from "~/components/Exchange/ExchangeTable";
import { autoPrefix } from "~/utils/helper";

export default function DemoExchangeForm() {
  const days = useMemo(() => {
    return autoPrefix(true);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* 
      <section className="flex justify-center pt-20 text-center align-middle">
        <table
          className={
            "rounded-md border-2 border-red-950 p-5 text-center align-middle font-mono"
          }
        >
          <tbody>
            <tr className={""}>
              <td rowSpan={4}>姓名</td>
              <td rowSpan={4}>員工號碼</td>
              <td rowSpan={4}>職級</td>
              <td rowSpan={4}>週數</td>
              <td rowSpan={4}>狀態</td>
              <td colSpan={8}>調更詳情</td>
              <td rowSpan={4}>編定輪次</td>
              <td rowSpan={4}>私鐘</td>
              <td rowSpan={4}>Signature</td>
            </tr>
            <tr>
              <td>12/06</td>
              <td>13/06</td>
              <td>14/06</td>
              <td>15/06</td>
              <td>16/06</td>
              <td>17/06</td>
              <td>18/06</td>
              <td>19/06</td>
            </tr>
            <tr>
              <td>MON</td>
              <td>TUE</td>
              <td>WED</td>
              <td>THU</td>
              <td>FRI</td>
              <td>SAT</td>
              <td>SUN</td>
              <td>MON</td>
            </tr>
            <tr>
              <td>C15</td>
              <td>C15</td>
              <td>A14</td>
              <td>D15</td>
              <td>D15</td>
              <td>A75</td>
              <td>U71</td>
              <td>C15</td>
            </tr>
            <tr>
              <td rowSpan={2}>NGSH</td>
              <td rowSpan={2}>6029XX</td>
              <td rowSpan={2}>G50</td>
              <td rowSpan={2}>22</td>
              <td>前</td>
              <td></td>
              <td>145</td>
              <td>146</td>
              <td>147</td>
              <td>148</td>
              <td>RD</td>
              <td></td>
              <td></td>
              <td rowSpan={2}>A55</td>
              <td rowSpan={2}>-0.75</td>
              <td rowSpan={2}></td>
            </tr>
            <tr>
              <td>後</td>
              <td></td>
              <td></td>
              <td>133</td>
              <td>134</td>
              <td>135</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td rowSpan={2}>SHIUTK</td>
              <td rowSpan={2}>5032XX</td>
              <td rowSpan={2}>G50</td>
              <td rowSpan={2}>22</td>
              <td>前</td>
              <td></td>
              <td>RD</td>
              <td>133</td>
              <td>134</td>
              <td>135</td>
              <td>136</td>
              <td></td>
              <td></td>
              <td rowSpan={2}>A81</td>
              <td rowSpan={2}>+0.75</td>
              <td rowSpan={2}></td>
            </tr>
            <tr>
              <td>後</td>
              <td></td>
              <td></td>
              <td>146</td>
              <td>147</td>
              <td>148</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </section>
          */}

      <ExchangeTable
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
            },
            weekNumber: "49",
          },
        ]}
      />
    </div>
  );
}

{
  happy: "123";
}
