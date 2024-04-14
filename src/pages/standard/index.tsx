import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '~/components/ui/select';

function StandardDutyPage() {
    const r = useRouter();
    const [category, setCategory] = useState();
    useEffect(() => {
        return;
    }, []);

    return (
        <>
            <h1>This is standard duty page</h1>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="A">KLN</SelectItem>
                    <SelectItem value="B">SHS</SelectItem>
                    <SelectItem value="C">ET</SelectItem>
                </SelectContent>
            </Select>
            <Input type="number" />
        </>
    );
}

export default StandardDutyPage;
