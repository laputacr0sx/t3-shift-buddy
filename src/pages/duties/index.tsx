import { GetServerSideProps, InferGetStaticPropsType } from 'next';
import PageTitle from '~/components/PageTitle';

function Duties({
  duties
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return (
    <>
      <PageTitle>DUTY PAGE</PageTitle>
      <pre>{duties}</pre>
    </>
  );
}

export default Duties;

export function getServerSideProps() {
  return { props: { duties: 'null' } };
}
