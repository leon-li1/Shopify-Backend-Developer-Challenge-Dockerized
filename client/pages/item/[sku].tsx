import Link from 'next/link';
import { useRouter } from "next/router";
import { FormEvent } from "react";
import useSWR from "swr";
import axios from 'axios';

const fetcher = (url: string) => fetch(url).then(res => res.json())

const ItemPage = () => {
    const { sku } = useRouter().query as {sku:string};
    const { data: item, error } = useSWR(sku ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/${sku}` : null, fetcher)

    if (error) return <div>failed to load</div>
    if (!item) return <div>loading...</div>
    
    return (
        <div>
            <Link href="/"><button>Back to items</button></Link>
            <h1>{item.sku} – {item.name}</h1>
            <form onSubmit={e => updateItem(sku, e)}>
                <label>Name</label><br/>
                <input name="name" defaultValue={item.name} /><br/>
                <label>Description</label><br/>
                <input name="description" defaultValue={item.description}/><br/>
                <label>Name</label><br/>
                <input name="color" defaultValue={item.color}/><br/>
                <label>Size</label><br/>
                <input name="size" defaultValue={item.size}/><br/>
                <label>Count</label><br/>
                <input name="count" defaultValue={item.count}/><br/><br/>
                <button type="submit">Save</button>
            </form>
            <br/>
            <button onClick={() => deleteItem(sku)}>Delete this Item</button>
        </div>
    )
}

async function updateItem(sku: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    try {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/${sku}`, {
            name: data.get('name'),
            description: data.get('description'),
            color: data.get('color'),
            size: data.get('size'),
            count: data.get('count'),
        })
        window.location.reload();
    } catch (error) {
        const errorMsg: string = (error as any)?.response?.data?.detail ?? 'Unknown error';
        alert('ERROR: ' + errorMsg);
    }
}

async function deleteItem(sku: string) {
    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/${sku}`);
        window.location.replace('/');
    } catch (error) {
        const errorMsg: string = (error as any)?.response?.data?.detail ?? 'Unknown error';
        alert('ERROR: ' + errorMsg);
    }
}


export default ItemPage;
