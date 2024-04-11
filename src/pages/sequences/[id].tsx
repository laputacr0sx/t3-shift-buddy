import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { createServerSideHelpers } from '@trpc/react-query/server';
import moment from 'moment';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from 'next';
import superjson from 'superjson';
import { appRouter } from '~/server/api/root';
import { createContextInner } from '~/server/api/trpc';
import { api } from '~/utils/api';

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const sequenceId = context.params?.id as string;

  const auth = getAuth(context.req);
  const user = await clerkClient.users.getUser(auth.userId ?? '');
  const clerkMeta = user.privateMetadata;

  const today = moment().format('YYYYMMDD ddd');

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createContextInner({ auth, user, clerkMeta }),
    transformer: superjson
  });

  await helpers.sequenceController.getSequence.prefetch({ sequenceId });
  await helpers.weekDetailsController.getDetails.prefetch({
    weekDifference: 0
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      sequenceId,
      today
    }
  };
}

type DayViewProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function PostViewPage(props: DayViewProps) {
  const { today } = props;

  const {
    data: weekDetails,
    status: weekDetailsStatus,
    isLoading: weekDetailsLoading
  } = api.weekDetailsController.getDetails.useQuery({
    weekDifference: 0
  });

  if (weekDetailsStatus !== 'success') {
    return <>Loading...</>;
  }

  if (weekDetailsLoading) return <>Loading...</>;

  const todayDetail = weekDetails.detailsWithWeather.filter(
    (detail) => detail.date === today
  )[0];

  return (
    <>
      <h1>{weekDetails.articulatedTitle}</h1>
      <h1>{todayDetail?.date}</h1>
      <p>{todayDetail?.timetable.prefix}</p>
      <p>{todayDetail?.actualDuty}</p>
      <pre>{JSON.stringify(todayDetail, null, 2)}</pre>
    </>
  );
}
