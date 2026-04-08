export default function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4 bg-gray-500 rounded-lg shadow-md">
            {children}
        </div>
    );
}