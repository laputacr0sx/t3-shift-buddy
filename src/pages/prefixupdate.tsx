// // import { api } from "~/utils/api";

// import {
//     autoPrefix,
//     getNextWeekDates,
//     getWeekNumberByDate
// } from '~/utils/helper';
// import { type NextPageWithLayout } from './_app';
// import { useEffect, type ReactElement, useState, useMemo } from 'react';
// import Layout from '~/components/ui/layouts/AppLayout';
// import DynamicUpdatePrefixForm from '~/components/PrefixUpdateForm';
// import moment from 'moment';
// import { Button } from '~/components/ui/button';
// import { Minus, Plus } from 'lucide-react';

// const PrefixUpdate: NextPageWithLayout = () => {
//     const [currentWeekNumber, setCurrentWeekNumber] = useState(1);

//     const memoWeekNumber = useMemo(() => getWeekNumberByDate().toString(), []);

//     const autoDayDetail = useMemo(
//         () => autoPrefix(false, memoWeekNumber),
//         [memoWeekNumber]
//     );

//     const {
//         data: currentWeekPreix,
//         isLoading: currentWeekPrefixLoading,
//         error: currentPrefixError
//     } = api.prefixController.getPrefixGivenWeekNumber.useQuery(
//         {
//             weekNumber: currentWeekNumber
//         },
//         {
//             refetchOnWindowFocus: false
//         }
//     );

//     useEffect(() => {
//         const weekNumber = getWeekNumberByDate();
//         setCurrentWeekNumber(weekNumber);
//     }, [currentWeekNumber]);

//     if (currentWeekPrefixLoading) return <>Loading...</>;

//     if (currentPrefixError)
//         return (
//             <>
//                 <h1>{currentPrefixError.message}</h1>
//             </>
//         );

//     const prefixDetails = autoDayDetail.map(({ prefix: numericPrefix }) => {
//         const alphabeticPrefix =
//             currentWeekPreix.result.prefixes
//                 .filter((prefix) => numericPrefix === prefix.slice(1))[0]
//                 ?.slice(0, 1) || '';

//         // setPrefixDetail((prev) => [
//         //   ...prev,
//         //   { alphabeticPrefix, numericPrefix },
//         // ]);
//         return {
//             alphabeticPrefix,
//             numericPrefix
//         };
//     });

//     return (
//         <div>
//             <h1 className="justify-center py-5 text-center text-4xl font-semibold text-foreground">
//                 改更易
//             </h1>
//             <p className="font-mono text-xs">
//                 {moment().format(`今日係 YYYY年 第W週 MM月DD日（ddd）`)}
//             </p>

//             <div className="flex flex-col items-center justify-center gap-4">
//                 <section>
//                     <Button
//                         onClick={() => {
//                             setCurrentWeekNumber((prev) => {
//                                 return prev + 1;
//                             });
//                         }}
//                     >
//                         <Plus />
//                     </Button>
//                     <Button
//                         onClick={() => {
//                             setCurrentWeekNumber((prev) => {
//                                 return prev - 1;
//                             });
//                         }}
//                     >
//                         <Minus />
//                     </Button>
//                 </section>

//                 <DynamicUpdatePrefixForm
//                     currentWeekNumber={currentWeekNumber}
//                     dates={getNextWeekDates()}
//                     prefixDetails={prefixDetails}
//                 />
//             </div>
//         </div>
//     );
// };

// // PrefixUpdate.getLayout = function getLayout(page: ReactElement) {
// //   return <Layout>{page}</Layout>;
// // };

// // export default PrefixUpdate;
