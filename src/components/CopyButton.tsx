import { useClipboard } from '~/hooks/useClipboard';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';
import { Copy } from 'lucide-react';
import { completeShiftNameRegex } from '~/utils/regex';

type CopyButtonProps = {
    str: string;
};

function CopyButton({ str }: CopyButtonProps) {
    const clipboard = useClipboard();
    const stringTooShort = str.length === 0;
    const duties = str.match(completeShiftNameRegex);

    return (
        <Button
            disabled={stringTooShort}
            onClick={(e) => {
                e.preventDefault();
                if (!clipboard) {
                    toast.error('Cannot find Clipboard in your system');
                    return;
                }
                clipboard
                    .writeText(str)
                    .then(() => {
                        if (!duties) {
                            toast.loading('Nothing Copied');
                            return;
                        }
                        toast.success(duties.join('\n') + '\n 已複製', {
                            duration: 800
                        });
                    })
                    .catch(() => {
                        toast.error('Something went wrong');
                    });
            }}
            variant={'ghost'}
        >
            <Copy />
        </Button>
    );
}

export default CopyButton;
