import { TRPCError } from '@trpc/server';
import { getErrorShape } from '@trpc/server/shared';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function useToastError({ errors }: { errors: TRPCError[] }) {
    useEffect(() => {
        errors.map((err) => toast.error(err.message));

        return () => {
            toast.dismiss();
        };
    }, [errors]);
}
