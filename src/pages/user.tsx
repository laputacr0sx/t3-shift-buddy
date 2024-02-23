import React, { type ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '~/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage
} from '~/components/ui/form';
import { api } from '~/utils/api';
import { userPrivateMetadataSchema } from '~/utils/zodSchemas';
import { Input } from '~/components/ui/input';
import { type NextPageWithLayout } from './_app';
import Layout from '~/components/ui/layouts/AppLayout';
import toast from 'react-hot-toast';
import useGetUsermeta from '~/hooks/useGetUsermeta';
import PageTitle from '~/components/PageTitle';
import moment from 'moment';
import { type UserPrivateMetadata } from '~/utils/customTypes';

function UserMetadataForm() {
    const userData = useGetUsermeta();
    const correspondingMoment = moment();

    const { mutate } = api.userController.setUserMetadata.useMutation({
        onSuccess: () =>
            toast.success('保存成功', { position: 'bottom-center' }),
        onError: () => toast.error('保存失敗', { position: 'bottom-center' })
    });

    const userPrivateMetadataForm = useForm<UserPrivateMetadata>({
        resolver: zodResolver(userPrivateMetadataSchema),
        defaultValues: {
            row: '',
            staffId: '',
            weekNumber: 0
        },
        values: userData ?? { row: '', staffId: '', weekNumber: 0 }
    });

    function metadataHandler(values: UserPrivateMetadata) {
        return mutate(values);
    }

    return (
        <>
            <Form {...userPrivateMetadataForm}>
                <form
                    onSubmit={userPrivateMetadataForm.handleSubmit(
                        metadataHandler
                    )}
                    className="space-y-8"
                >
                    <FormField
                        control={userPrivateMetadataForm.control}
                        name="staffId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>職員號碼</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    職員號碼一經輸入，不可更改。
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={userPrivateMetadataForm.control}
                        name="row"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>行序編號</FormLabel>
                                <FormDescription>
                                    {correspondingMoment.format(
                                        `YYYY-MM-DD第W週`
                                    )}
                                    的行序編號。
                                </FormDescription>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={userPrivateMetadataForm.control}
                        name="weekNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>週份</FormLabel>
                                <FormDescription></FormDescription>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-2">
                        <Button
                            type="submit"
                            variant={'outline'}
                            // disabled={!!userData}
                        >
                            更改
                        </Button>
                    </div>
                </form>
            </Form>
            {/* {userData?.staffId ? (
                <ChineseCalendars staffId={userData.staffId} />
            ) : null} */}
        </>
    );
}

const User: NextPageWithLayout = () => (
    <React.Fragment>
        <PageTitle>用戶資料</PageTitle>
        <UserMetadataForm />
    </React.Fragment>
);

User.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default User;
