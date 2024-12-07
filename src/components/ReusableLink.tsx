import Link from "next/link";

export default function ReusableLink({href, children, color, textColor, colorHover}) {
    return (
        <Link href={href} className={`rounded-[20px] p-4`}
            style={{ backgroundColor: color, color : textColor,transition: "background-color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colorHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = color)}
            >
            {children}
        </Link>
    )
}