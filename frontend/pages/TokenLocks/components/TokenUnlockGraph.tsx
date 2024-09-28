import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DataPoint {
    date: Date;
    tokens: number;
}

const initialData: DataPoint[] = [
    { date: new Date('2024-01-15T10:00:00'), tokens: 1000 },
    { date: new Date('2024-02-03T14:30:00'), tokens: 2000 },
    { date: new Date('2024-03-20T09:45:00'), tokens: 3000 },
    { date: new Date('2024-05-05T16:20:00'), tokens: 5000 },
    { date: new Date('2024-08-12T11:10:00'), tokens: 8000 },
    { date: new Date('2024-12-25T00:00:00'), tokens: 13000 },
];

const TokenUnlockGraph: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>(initialData);
    const [hoverInfo, setHoverInfo] = useState<DataPoint | null>(null);

    const addRandomUnlock = () => {
        const lastDate = data[data.length - 1].date;
        const newDate = new Date(lastDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        const newDataPoint: DataPoint = {
            date: newDate,
            tokens: data[data.length - 1].tokens + Math.floor(Math.random() * 5000) + 1000,
        };
        setData([...data, newDataPoint]);
    };

    const handleMouseHover = (hoverData: any) => {
        if (hoverData && hoverData.activePayload) {
            setHoverInfo(hoverData.activePayload[0].payload);
        } else {
            setHoverInfo(null);
        }
    };

    const formatXAxis = (tickItem: number) => {
        return new Date(tickItem).toLocaleDateString();
    };

    const formatTooltip = (value: number, name: string, props: { payload: DataPoint }) => {
        if (name === 'tokens') {
            return [`Date: ${props.payload.date.toLocaleString()}`, `Tokens: ${value}`];
        }
        return [];
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <h2 className="text-2xl font-bold">Token Unlock Schedule</h2>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Button onClick={addRandomUnlock}>Add Random Unlock</Button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        onMouseMove={handleMouseHover}
                        onMouseLeave={() => setHoverInfo(null)}
                    >
                        <CartesianGrid />
                        <XAxis
                            dataKey="date"
                            domain={['auto', 'auto']}
                            name="Date"
                            tickFormatter={formatXAxis}
                            type="number"
                            scale="time"
                        />
                        <YAxis dataKey="tokens" name="Tokens" />
                        <Tooltip formatter={formatTooltip} />
                        <Legend />
                        <Scatter name="Token Unlocks" data={data.map(d => ({ ...d, date: d.date.getTime() }))} fill="#8884d8" />
                    </ScatterChart>
                </ResponsiveContainer>
                {hoverInfo && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold">Hover Information:</h3>
                        <p>Date: {new Date(hoverInfo.date).toLocaleString()}</p>
                        <p>Tokens Unlocked: {hoverInfo.tokens}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TokenUnlockGraph;