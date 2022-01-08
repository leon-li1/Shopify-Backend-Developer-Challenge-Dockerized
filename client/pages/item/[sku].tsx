import { useRouter } from "next/router";
import { FormEvent } from "react";
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

const ItemPage = () => {
    const { sku } = useRouter().query as {sku:string};
    const { data: item, error } = useSWR(sku ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/${sku}` : null, fetcher)

    if (error) return <div>failed to load</div>
    if (!item) return <div>loading...</div>
    
    return (
        <div>
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
        </div>
    )
}

async function updateItem(sku: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    try {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/${sku}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.get('name'),
                description: data.get('description'),
                color: data.get('color'),
                size: data.get('size'),
                count: data.get('count'),
            })
        })
        window.location.reload();
    } catch (error) {
        alert('ERROR: ' + (error as any).message);
    }
}

export default ItemPage;
