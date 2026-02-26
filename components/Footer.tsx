export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white px-6 py-4 text-sm text-gray-500 flex items-center justify-between">
            <span>© {new Date().getFullYear()} WorkNearMe</span>
            <span>Find local gigs &amp; short-term work near you.</span>
        </footer>
    );
}