import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Italic, List, ListOrdered,
    Strikethrough
} from "lucide-react";
import {Editor} from "@tiptap/react";
import {Toggle} from "@/components/ui/toggle";

interface Option {
    icon: any;
    onClick: () => void;
    pressed: boolean | undefined;
}

export const MenuBar = ({editor}:{editor: Editor | null }) => {

    const options: Array<Option > = [
        {
            icon: Heading1,
            onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
            pressed: editor?.isActive('heading', { level: 1 }),
        },
        {
            icon: Heading2,
            onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            pressed: editor?.isActive('heading', { level: 2 }),
        },
        {
            icon: Heading3,
            onClick: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
            pressed: editor?.isActive('heading', { level: 3 }),
        },
        {
            icon: Bold,
            onClick: () => editor?.chain().focus().toggleBold().run(),
            pressed: editor?.isActive('bold'),
        },
        {
            icon: Italic,
            onClick: () => editor?.chain().focus().toggleItalic().run(),
            pressed: editor?.isActive('italic'),
        },
        {
            icon: Strikethrough,
            onClick: () => editor?.chain().focus().toggleStrike().run(),
            pressed: editor?.isActive('strike'),
        },
        {
            icon: AlignLeft,
            onClick: () => editor?.chain().focus().setTextAlign('left').run(),
            pressed: editor?.isActive({textAlign: 'left'}),
        },
        {
            icon: AlignCenter,
            onClick: () => editor?.chain().focus().setTextAlign('center').run(),
            pressed: editor?.isActive({textAlign: 'center'}),
        },
        {
            icon: AlignRight,
            onClick: () => editor?.chain().focus().setTextAlign('right').run(),
            pressed: editor?.isActive({textAlign: 'right'}),
        },
        {
            icon: List,
            onClick: () => editor?.chain().focus().toggleBulletList().run(),
            pressed: editor?.isActive('bulletList'),
        },
        {
            icon: ListOrdered,
            onClick: () => editor?.chain().focus().toggleOrderedList().run(),
            pressed: editor?.isActive('orderedList'),
        },
        /*{
            icon: Highlighter,
            onClick: () => editor?.chain().focus().toggleHighlight().run(),
            pressed: editor?.isActive('highlight'),
        },*/


    ]
    if (!editor) {
        return null
    }

    return (
        <div className={'flex border rounded-md bg-slate-200 space-x-2 z-50 '}>
            {options.map((option, index) => (

                <Toggle pressed={option.pressed} key={index} onPressedChange={option.onClick} className={'flex'}>
                    <option.icon size={32} className={'size-6'} />
                </Toggle>
            ))}
        </div>
    )

}