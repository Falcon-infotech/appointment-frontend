import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown } from "lucide-react"

type Option = {
    value: string
    label: string
}

type MultiSelectProps = {
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
}

export default function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Select options",
}: MultiSelectProps) {
    const toggleOption = (id: string) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id))
        } else {
            onChange([...value, id])
        }
    }

    console.log(options)
    

    return (
        <div>
            <DropdownMenu >
                <DropdownMenuTrigger asChild >
                    <Button variant="outline" className="flex items-center justify-between w-full ">
                        {value?.length > 0
                            ?
                            // options
                            //     .filter((opt) => value.includes(opt.value))
                            //     .map((opt) => opt.label)
                            //     .join(", ")
                             `${value.length} selected`
                            : placeholder}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
                    {options.map((opt) => (
                        <div
                            key={opt.label}
                            className="flex items-center space-x-2 px-2 py-1.5 cursor-pointer w-full"

                        >
                            <label
                                key={opt.label}
                                className="flex items-center space-x-2 px-2 py-1.5 cursor-pointer w-full"
                            >
                                <Checkbox
                                    checked={value?.includes(opt.value)}
                                    onCheckedChange={() => toggleOption(opt.value)}
                                />
                                <span className="text-sm">{opt.label}</span>
                            </label>

                        </div>
                    ))}
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1 text-xs text-muted-foreground w-full">
                        {value?.length} selected
                    </div>
                </DropdownMenuContent>

            </DropdownMenu>
        </div>
    )
}
