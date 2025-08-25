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

type SelectedItem = { _id: string }

type MultiSelectProps = {
  options: Option[]
  value: SelectedItem[]                
  onChange: (value: SelectedItem[]) => void
  placeholder?: string
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
}: MultiSelectProps) {
  const toggleOption = (id: string) => {
    if (value.some((v) => v._id === id)) {
      onChange(value.filter((v) => v._id !== id))
    } else {
      onChange([...value, { _id: id }]) 
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between w-full"
          >
            {value?.length > 0
              ? `${value.length} selected`
              : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center space-x-2 px-2 py-1.5 cursor-pointer w-full"
            >
              <Checkbox
                checked={value.some((v) => v._id === opt.value)}
                onCheckedChange={() => toggleOption(opt.value)}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
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
