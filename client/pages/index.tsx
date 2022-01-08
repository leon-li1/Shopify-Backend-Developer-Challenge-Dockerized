import styled from 'styled-components'
import useSWR from 'swr'
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
  const { data: items, error } = useSWR('/api/item/list', fetcher)

  if (error) return <div>failed to load</div>
  if (!items) return <div>loading...</div>

  return (
    <div>
      <h1>Inventory Tracker</h1>
      <table>
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
      </table>
    </div>
  )
}

