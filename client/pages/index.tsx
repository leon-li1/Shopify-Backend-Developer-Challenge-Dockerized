import styled from 'styled-components'
import useSWR from 'swr'
import Link from 'next/link';
import React, { useCallback } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
  const { data: items, error } = useSWR(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item/list`, fetcher)

  if (error) return <div>failed to load</div>
  if (!items) return <div>loading...</div>

  return (
    <div>
      <h1>Inventory Tracker</h1>
      {!!items.length && <table>
        <thead>
          <tr>
            <th>Sku</th>
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
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: data.get('sku'),
          name: data.get('name'),
          description: data.get('description'),
          size: data.get('size'),
          color: data.get('color'),
          count: data.get('count'),
        })
      });
      window.location.replace('/item/' + data.get('sku'));
    } catch (error) {
      alert('ERROR: ' + (error as any).message);
    }
  };
  
  return (
    <form onSubmit={onSubmit}>
      <h3>Create a new item</h3>
      <label>SKU</label><br/>
      <input name="sku"/><br/>
      <label>Name</label><br/>
      <input name="name" /><br/>
      <label>Description</label><br/>
      <input name="description" /><br/>
      <label>Size</label><br/>
      <input name="size" /><br/>
      <label>Color</label><br/>
      <input name="color" /><br/>
      <label>Count</label><br/>
      <input type="number" name="count" /><br/>
      <button type="submit">Create</button>
    </form>
  );
}

