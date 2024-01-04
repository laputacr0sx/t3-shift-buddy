// import { type Shift } from "@prisma/client";
// import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
// import { convertDurationDecimal } from "~/utils/helper";

// const columnHelper = createColumnHelper<Shift>();

// export const AllShiftsColumns: ColumnDef<Shift>[] = [
//   columnHelper.group({
//     id: "detail",
//     header: () => (
//       <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-slate-700 dark:border-sky-300 dark:text-slate-300">
//         更餡
//       </span>
//     ),
//     columns: [
//       columnHelper.accessor("dutyNumber", {
//         header: () => (
//           <span className="block text-center align-middle text-slate-700 dark:text-slate-300">
//             更號
//           </span>
//         ),
//         cell: ({ row }) => {
//           const dutyNumber: string = row.getValue("dutyNumber");
//           return (
//             <span className="block py-2 text-center align-middle text-slate-600 dark:text-slate-200">
//               {dutyNumber}
//             </span>
//           );
//         },
//         footer: (props) => props.column.id,
//       }),
//       {
//         accessorKey: "duration",
//         header: () => (
//           <span className="block text-center align-middle text-slate-700 dark:text-slate-300">
//             工時
//           </span>
//         ),
//         cell: ({ row }) => {
//           const duration: string = row.getValue("duration");
//           const durationDecimal = convertDurationDecimal(duration);

//           return (
//             <span className="block py-2 text-center align-middle font-medium text-slate-600 dark:text-slate-200">
//               {durationDecimal}
//             </span>
//           );
//         },
//         footer: (props) => props.column.id,
//       },
//     ],
//   }),
//   columnHelper.group({
//     id: "bookOn",
//     header: () => (
//       <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-teal-700 dark:border-sky-300 dark:text-teal-400">
//         上班
//       </span>
//     ),
//     columns: [
//       columnHelper.accessor("bNL", {
//         header: () => (
//           <span className="block text-center align-middle text-teal-700 dark:text-teal-200">
//             地點
//           </span>
//         ),
//         cell: ({ row }) => {
//           const bNL: string = row.getValue("bNL");
//           return (
//             <span className="block py-2 text-center align-middle font-medium text-teal-600 dark:text-teal-200">
//               {bNL}
//             </span>
//           );
//         },
//         footer: (props) => props.column.id,
//       }),
//       columnHelper.accessor("bNT", {
//         header: () => (
//           <span className="block text-center align-middle text-teal-700 dark:text-teal-200">
//             時間
//           </span>
//         ),
//         cell: ({ row }) => {
//           const bNT: string = row.getValue("bNT");
//           return (
//             <span className="block py-2 text-center align-middle font-medium text-teal-600 dark:text-teal-200">
//               {bNT}
//             </span>
//           );
//         },
//         footer: (props) => props.column.id,
//       }),
//     ],
//   }),
//   columnHelper.group({
//     id: "bookOff",
//     header: () => (
//       <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-rose-700 dark:border-sky-300 dark:text-rose-400">
//         下班
//       </span>
//     ),
//     columns: [
//       {
//         accessorKey: "bFT",
//         header: () => (
//           <span className="block text-center align-middle text-rose-700 dark:text-rose-300">
//             時間
//           </span>
//         ),
//         cell: ({ row }) => {
//           const bFT: string = row.getValue("bFT");
//           return (
//             <span className="block py-2 text-center align-middle font-medium text-rose-600 dark:text-rose-200">
//               {bFT}
//             </span>
//           );
//         },
//         footer: (props) => props.column.id,
//       },
//       {
//         accessorKey: "bFL",
//         header: () => (
//           <span className="block text-center align-middle text-rose-700 dark:text-rose-300">
//             地點
//           </span>
//         ),
//         cell: ({ row }) => {
//           const bFL: string = row.getValue("bFL");
//           return (
//             <span className="block py-2 text-center align-middle font-medium text-rose-600 dark:text-rose-200">
//               {bFL}
//             </span>
//           );
//         },
//         footer: (props) => props.column.id,
//       },
//     ],
//   }),
//   columnHelper.group({
//     id: "remarks",
//     header: () => (
//       <span className="block border-x border-solid border-sky-700 text-center align-middle text-xl text-amber-700 dark:border-sky-300 dark:text-amber-300">
//         備註
//       </span>
//     ),
//     columns: [
//       columnHelper.accessor("remarks", {
//         header: () => <p></p>,
//         cell: ({ row }) => {
//           const remarks: string = row.getValue("remarks");
//           return (
//             <span className="block py-2 text-left align-middle font-medium text-amber-600 dark:text-amber-200">
//               {remarks}
//             </span>
//           );
//         },
//       }),
//     ],
//   }),
// ];
