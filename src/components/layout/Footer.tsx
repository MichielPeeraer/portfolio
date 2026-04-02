export default function Footer() {
    return (
        <footer className="relative z-10 text-center py-6 border-t border-green-400/20 text-green-600 text-sm font-mono">
            © {new Date().getFullYear()} Michiel Peeraer · Made with Next.js
        </footer>
    )
}
