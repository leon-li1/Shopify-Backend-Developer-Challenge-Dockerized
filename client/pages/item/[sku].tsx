import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

const ItemPage = () => {
    const { sku } = useRouter().query as {sku:string};
    const { data: item, error } = useSWR(`/api/item/${sku}`, fetcher)

    if (error) return <div>failed to load</div>
    if (!item) return <div>loading...</div>
    
    return (
        <div>
            <h1>{item.sku} – {item.name}</h1>
            <form onSubmit={(e) => updateItem(sku, e.target.)}>
                <input id="name">{item.name}</input>
                <input id="description">{item.description}</input>
                {item.color && <input id="color">{item.color}</input>}
                {item.size && <input id="size">{item.size}</input>}
                <input id="count">{item.count}</input>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

async function updateItem(sku: string, data: any) {
    console.log(data);
    // const response = await fetch('/api/item', {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({

    //     })
    // })

}

export default ItemPage;
