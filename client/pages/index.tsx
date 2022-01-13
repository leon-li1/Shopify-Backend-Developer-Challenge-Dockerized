import useSWR from 'swr'
import Link from 'next/link';
import React from 'react';
import axios from 'axios';

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
    const { data: items, error } = useSWR(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/list`, fetcher)

    if (error) return <div>failed to load</div>
    if (!items) return <div>loading...</div>

    return (
        <div>
            <h1>Inventory Tracker</h1>
            <button disabled={!items.length} onClick={exportCsv}>Export to CSV</button>
            {!!items.length && <table>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
            {items.map(item => (
                <tr key={item.sku}>
                    <td><Link href={`/item/${item.sku}`}>{item.sku}</Link></td>
                    <td>{item.name}</td>
                    <td>{item.count}</td>
                </tr>
            ))}
            </tbody>
            </table>}
            {!items.length && <p>Inventory is empty!</p>}
            <CreateItemForm />
        </div>
    )
}

const CreateItemForm = () => {
    return (
        <form onSubmit={createItem}>
            <h3>Create a new item</h3>
            <label>SKU</label><br/>
            <input name='sku' placeholder='Enter SKU'/><br/>
            <label>Name</label><br/>
            <input name='name' placeholder='Enter name'/><br/>
            <label>Description</label><br/>
            <input name='description' placeholder='Enter description'/><br/>
            <label>Size</label><br/>
            <input name='size' placeholder='Enter size'/><br/>
            <label>Color</label><br/>
            <input name='color' placeholder='Enter color'/><br/>
            <label>Count</label><br/>
            <input type='number' name='count' defaultValue={1}/><br/>
            <button type='submit'>Create</button>
        </form>
    );
}

const createItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);

    try {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item`, { 
            sku: data.get('sku'),
            name: data.get('name'),
            description: data.get('description'),
            size: data.get('size'),
            color: data.get('color'),
            count: data.get('count'),
        });
        window.location.replace('/item/' + data.get('sku'));
    } catch (error) {
        const errorMsg: string = (error as any)?.response?.data?.detail ?? 'Unknown error';
        alert('ERROR: ' + errorMsg);
    }
};

const exportCsv = () => {
    window.open(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/export`);
};