"use client";

import { useField, useFormikContext } from "formik";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import Button from "@/components/common/Button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePickerField({
    name,
    onChange,
}: {
    name: string;
    onChange?: (date: Date | undefined) => void;
}) {
    const [field] = useField(name);
    const { setFieldValue, setFieldTouched } = useFormikContext();

    const selectedDate = field.value ? new Date(field.value) : undefined;

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        classes="w-full justify-start border border-input bg-background text-left font-normal"
                        onBlur={() => setFieldTouched(name, true)}
                        icon={<CalendarIcon className="mr-2 h-4 w-4" />}
                        text={selectedDate ? format(selectedDate, "dd MMM yyyy") : "Pick a date"}
                    />
                }
            />
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                        if (date) {
                            setFieldValue(name, format(date, "yyyy-MM-dd"));
                        }
                        setFieldTouched(name, true);
                        onChange?.(date);
                    }}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    );
}
