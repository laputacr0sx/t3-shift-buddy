import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '~/utils/api';

export default function useGetUsermeta() {
    const {
        data: userData,
        isLoading: userLoading,
        error: userError
    } = api.userController.getUserMetadata.useQuery(undefined, {
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (userLoading) {
            toast.loading('Loading...');
        }

        return () => {
            toast.dismiss();
        };
    }, [userLoading]);

    useEffect(() => {
        const errorCode = userError?.data?.code;

        if (!errorCode) return;

        switch (errorCode) {
            case 'UNAUTHORIZED':
                toast.error('閣下尚未登入未登入。', { duration: 2000 });
                break;
            case 'NOT_FOUND':
                toast.error('找不到用戶。', { duration: 2000 });
                break;
            case 'PARSE_ERROR':
                toast.error('資料與數據庫不符。', { duration: 2000 });
                break;
            default:
                toast.error('Something went wrong.', { duration: 2000 });
        }

        return () => {
            toast.dismiss();
        };
    }, [userError]);

    // if (userError) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return userLoading
        ? ({
              staffId: '000000',
              row: 'A1',
              weekNumber: 1
          } satisfies UserPrivateMetadata)
        : userData;
}
