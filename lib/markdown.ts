export function renderMarkdown(text: string): string {
    return text
        // Headings
        .replace(/^### (.*?)$/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
        .replace(/^## (.*?)$/gm, "<h2 class='text-xl font-bold mt-4 mb-2'>$1</h2>")
        .replace(/^# (.*?)$/gm, "<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>")
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold'>$1</strong>")
        // Italic
        .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
        // Underline
        .replace(/__(.*?)__/g, "<u class='underline'>$1</u>")
        // Strikethrough
        .replace(/~~(.*?)~~/g, "<s class='line-through'>$1</s>")
        // Inline code
        .replace(/`(.*?)`/g, "<code class='bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>")
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-primary underline hover:text-primary/80' target='_blank' rel='noopener noreferrer'>$1</a>")
        // Blockquote
        .replace(/^> (.*?)$/gm, "<blockquote class='border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-2'>$1</blockquote>")
        // Lists
        .replace(/\n- /g, "<br />• ")
        .replace(/\n\d+\. /g, "<br />1. ")
        // Line breaks
        .replace(/\n/g, "<br />")
}

const TABLE_ROW = /^\s*\|.*\|\s*$/
const TABLE_SEPARATOR = /^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/

const ALIGN_CLASS = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
} as const

type Align = keyof typeof ALIGN_CLASS

const TABLE_STYLES = {
    sm: {
        wrapper: "not-prose overflow-x-auto my-4",
        table: "w-full border-collapse border border-border text-sm",
        cell: "border border-border px-3 py-2 align-top",
    },
    lg: {
        wrapper: "not-prose overflow-x-auto my-8",
        table: "w-full border-collapse border border-border text-base",
        cell: "border border-border px-4 py-3 align-top",
    },
}

function splitRow(line: string): string[] {
    return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim())
}

function parseAlign(cell: string): Align {
    const left = cell.startsWith(":")
    const right = cell.endsWith(":")
    if (left && right) return "center"
    if (right) return "right"
    return "left"
}

// Converts markdown pipe tables (| a | b |\n| --- | --- |\n| 1 | 2 |) to HTML.
// Run before the inline replacements so cell content still gets bold/links/etc.
export function renderTables(text: string, size: keyof typeof TABLE_STYLES = "sm"): string {
    const styles = TABLE_STYLES[size]
    const lines = text.split("\n")
    const out: string[] = []

    for (let i = 0; i < lines.length; i++) {
        if (!TABLE_ROW.test(lines[i]) || !TABLE_SEPARATOR.test(lines[i + 1] ?? "")) {
            out.push(lines[i])
            continue
        }

        const header = splitRow(lines[i])
        const aligns = splitRow(lines[i + 1]).map(parseAlign)
        const rows: string[][] = []
        let j = i + 2
        while (j < lines.length && TABLE_ROW.test(lines[j])) {
            rows.push(splitRow(lines[j]))
            j++
        }

        const cell = (tag: "th" | "td", content: string, col: number) =>
            `<${tag} class='${styles.cell} ${ALIGN_CLASS[aligns[col] ?? "left"]}'>${content}</${tag}>`

        const thead = `<thead class='bg-muted/50 font-semibold'><tr>${header.map((c, col) => cell("th", c, col)).join("")}</tr></thead>`
        const tbody = `<tbody>${rows
            .map((row) => `<tr class='even:bg-muted/20'>${header.map((_, col) => cell("td", row[col] ?? "", col)).join("")}</tr>`)
            .join("")}</tbody>`

        out.push(`<div class='${styles.wrapper}'><table class='${styles.table}'>${thead}${tbody}</table></div>`)
        i = j - 1
    }

    return out.join("\n")
}
