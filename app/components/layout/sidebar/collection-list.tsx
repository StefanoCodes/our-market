import { SidebarCollectionsQuery } from 'storefrontapi.generated'
import { CollectionItem } from './collection-item'
import { useState } from 'react'

// @params: collections an array of objects each objet has collection id, collectionName, collectionHandle, collectionTitle, CollectonImage
export default function CollectionList({ collections }: { collections: SidebarCollectionsQuery }) {
  // Add state to track which collection is expanded
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Function to handle toggling collections
  const handleToggle = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id))
  }
  return (
    <div className="flex flex-col gap-6">
      <ul>
        {collections.menu?.items.map(({ id, title, url, resource, items }) => (
          <li key={id}>
            <CollectionItem
              url={url}
              title={title}
              image={resource?.image}
              items={items}
              isExpanded={expandedId === id}
              onToggle={() => handleToggle(id)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
