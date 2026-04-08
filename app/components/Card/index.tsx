export default function Card({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <div className="p-4 bg-gray-500 rounded-lg shadow-md cursor-pointer" onClick={onClick}>
            {children}
        </div>
    );
}