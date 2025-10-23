'use client'

import {useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {MenuBar} from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {cn} from "@/lib/utils";


interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const TiptapEditor = ({value, onChange, placeholder = 'Ecrévez ici', className}: TiptapEditorProps) => {


    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-3'
                    }
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-3'
                    }
                }
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder
            })
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn("min-h-[170px] border rounded-sm p-4", className),
                placeholder: 'Ecrire ici !'
            },
        },
        onUpdate: ({editor}) => {
            onChange(editor.getHTML())
        },
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
    })

    return (
        <div className="flex flex-col gap-2">
            <MenuBar editor={editor}/>
            <EditorContent editor={editor}/>
        </div>
    )
}
