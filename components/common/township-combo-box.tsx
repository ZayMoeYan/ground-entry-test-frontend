import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { MYANMAR_LOCATIONS } from '@/lib/data/myanmar-locations';

const ALL_TOWNSHIPS = MYANMAR_LOCATIONS.flatMap((region) =>
    region.townships.map((township) => ({
        value: township,
        label: `${township} (${region.name.split(' ')[0]})`,
    }))
);

export function TownshipCombobox({
    value,
    onChange,
    placeholder = 'Search & Select Township...', // Default placeholder
}: {
    value?: string;
    onChange: (val: string) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    {value && value !== 'all'
                        ? ALL_TOWNSHIPS.find((item) => item.value === value)?.label || value
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-75 p-0">
                <Command>
                    <CommandInput placeholder="Search township..." />
                    <CommandList>
                        <CommandEmpty>No township found.</CommandEmpty>
                        <CommandGroup>
                            {ALL_TOWNSHIPS.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? '' : item.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === item.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}